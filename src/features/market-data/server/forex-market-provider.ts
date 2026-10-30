import type { MarketPriceItem } from "@/types/market-price";
import type {
  ForexResolvedInstrument,
  ForexSearchResultItem,
} from "@/types/forex-search";

const MARKET_PRICE_REVALIDATE_SECONDS = 60 * 5;
const FOREX_SEARCH_REVALIDATE_SECONDS = 60 * 10;

type ForexPair = {
  baseCurrency: string;
  quoteCurrency: string;
};

type ForexChartSnapshot = ForexResolvedInstrument;

function getOptionalString(value: object, key: string): string | null {
  if (!(key in value)) {
    return null;
  }

  const candidate = (value as Record<string, unknown>)[key];

  return typeof candidate === "string" && candidate.trim()
    ? candidate.trim()
    : null;
}

function parsePairFromName(name: string | null): ForexPair | null {
  if (!name) {
    return null;
  }

  const match = name.toUpperCase().match(/\b([A-Z]{3})\s*\/\s*([A-Z]{3})\b/);

  if (!match) {
    return null;
  }

  return {
    baseCurrency: match[1],
    quoteCurrency: match[2],
  };
}

function parsePairFromProviderSymbol(providerSymbol: string): ForexPair | null {
  const core = providerSymbol.trim().toUpperCase().replace(/=X$/, "");

  if (/^[A-Z]{6}$/.test(core)) {
    return {
      baseCurrency: core.slice(0, 3),
      quoteCurrency: core.slice(3),
    };
  }

  // Yahoo also uses compact aliases such as JPY=X for USD/JPY.
  if (/^[A-Z]{3}$/.test(core) && core !== "USD") {
    return {
      baseCurrency: "USD",
      quoteCurrency: core,
    };
  }

  return null;
}

function resolveForexPair({
  providerSymbol,
  name,
}: {
  providerSymbol: string;
  name: string | null;
}): ForexPair | null {
  return parsePairFromName(name) ?? parsePairFromProviderSymbol(providerSymbol);
}

function getLatestClose(result: unknown): number | null {
  if (
    typeof result !== "object" ||
    result === null ||
    !("indicators" in result) ||
    typeof result.indicators !== "object" ||
    result.indicators === null ||
    !("quote" in result.indicators) ||
    !Array.isArray(result.indicators.quote) ||
    result.indicators.quote.length === 0
  ) {
    return null;
  }

  const firstQuote = result.indicators.quote[0];

  if (
    typeof firstQuote !== "object" ||
    firstQuote === null ||
    !("close" in firstQuote) ||
    !Array.isArray(firstQuote.close)
  ) {
    return null;
  }

  for (let index = firstQuote.close.length - 1; index >= 0; index -= 1) {
    const close = firstQuote.close[index];

    if (typeof close === "number" && Number.isFinite(close) && close > 0) {
      return close;
    }
  }

  return null;
}

async function getForexChartSnapshot(
  providerSymbol: string,
): Promise<ForexChartSnapshot | null> {
  const normalizedSymbol = providerSymbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    return null;
  }

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        normalizedSymbol,
      )}?range=1d&interval=1d&includePrePost=false`,
      {
        next: {
          revalidate: MARKET_PRICE_REVALIDATE_SECONDS,
        },
      },
    );

    if (!response.ok) {
      console.error(
        `Yahoo Finance returned ${response.status} for forex ${normalizedSymbol}`,
      );

      return null;
    }

    const payload: unknown = await response.json();

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("chart" in payload) ||
      typeof payload.chart !== "object" ||
      payload.chart === null ||
      !("result" in payload.chart) ||
      !Array.isArray(payload.chart.result) ||
      payload.chart.result.length === 0
    ) {
      return null;
    }

    const result = payload.chart.result[0];

    if (typeof result !== "object" || result === null || !("meta" in result)) {
      return null;
    }

    const meta = result.meta;

    if (typeof meta !== "object" || meta === null) {
      return null;
    }

    const providerSymbolFromMeta =
      getOptionalString(meta, "symbol")?.toUpperCase() ?? normalizedSymbol;

    const displayName =
      getOptionalString(meta, "longName") ??
      getOptionalString(meta, "shortName") ??
      providerSymbolFromMeta;

    const pair = resolveForexPair({
      providerSymbol: providerSymbolFromMeta,
      name: displayName,
    });

    if (!pair) {
      return null;
    }

    const rawCurrency = getOptionalString(meta, "currency")?.toUpperCase();
    const quoteCurrency = rawCurrency ?? pair.quoteCurrency;

    if (!/^[A-Z]{3}$/.test(quoteCurrency)) {
      return null;
    }

    const regularMarketPrice =
      "regularMarketPrice" in meta &&
      typeof meta.regularMarketPrice === "number" &&
      Number.isFinite(meta.regularMarketPrice) &&
      meta.regularMarketPrice > 0
        ? meta.regularMarketPrice
        : null;

    const chartPreviousClose =
      "chartPreviousClose" in meta &&
      typeof meta.chartPreviousClose === "number" &&
      Number.isFinite(meta.chartPreviousClose) &&
      meta.chartPreviousClose > 0
        ? meta.chartPreviousClose
        : null;

    const price = regularMarketPrice ?? getLatestClose(result) ?? chartPreviousClose;

    const regularMarketTime =
      "regularMarketTime" in meta &&
      typeof meta.regularMarketTime === "number" &&
      Number.isFinite(meta.regularMarketTime)
        ? meta.regularMarketTime
        : null;

    const asOf =
      regularMarketTime !== null
        ? new Date(regularMarketTime * 1000).toISOString()
        : null;

    const baseCurrency = pair.baseCurrency;
    const resolvedPair = `${baseCurrency}/${quoteCurrency}`;

    const exchange =
      getOptionalString(meta, "fullExchangeName") ??
      getOptionalString(meta, "exchangeName") ??
      "Currency";

    const exchangeCode = getOptionalString(meta, "exchangeName");

    return {
      providerSymbol: providerSymbolFromMeta,
      pair: resolvedPair,
      symbol: baseCurrency,
      name: resolvedPair,
      baseCurrency,
      quoteCurrency,
      exchange,
      exchangeCode,
      currency: quoteCurrency,
      price,
      asOf,
    };
  } catch (error) {
    console.error(
      `Failed to load forex metadata for ${normalizedSymbol}:`,
      error,
    );

    return null;
  }
}

export async function searchForexPairs(
  query: string,
): Promise<ForexSearchResultItem[]> {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
        normalizedQuery,
      )}&quotesCount=10&newsCount=0&listsCount=0&enableFuzzyQuery=true`,
      {
        next: {
          revalidate: FOREX_SEARCH_REVALIDATE_SECONDS,
        },
      },
    );

    if (!response.ok) {
      console.error(`Yahoo Finance forex search returned ${response.status}.`);
      return [];
    }

    const payload: unknown = await response.json();

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("quotes" in payload) ||
      !Array.isArray(payload.quotes)
    ) {
      return [];
    }

    const results: ForexSearchResultItem[] = [];
    const seenProviderSymbols = new Set<string>();

    for (const quote of payload.quotes) {
      if (typeof quote !== "object" || quote === null) {
        continue;
      }

      const quoteType = getOptionalString(quote, "quoteType")?.toUpperCase();

      if (quoteType !== "CURRENCY") {
        continue;
      }

      const providerSymbol = getOptionalString(quote, "symbol")?.toUpperCase();

      if (!providerSymbol || seenProviderSymbols.has(providerSymbol)) {
        continue;
      }

      const yahooName =
        getOptionalString(quote, "longname") ??
        getOptionalString(quote, "shortname") ??
        providerSymbol;

      const pair = resolveForexPair({
        providerSymbol,
        name: yahooName,
      });

      if (!pair || pair.baseCurrency === pair.quoteCurrency) {
        continue;
      }

      const displayPair = `${pair.baseCurrency}/${pair.quoteCurrency}`;

      results.push({
        providerSymbol,
        pair: displayPair,
        symbol: pair.baseCurrency,
        name: displayPair,
        baseCurrency: pair.baseCurrency,
        quoteCurrency: pair.quoteCurrency,
        exchange:
          getOptionalString(quote, "exchDisp") ??
          getOptionalString(quote, "exchange") ??
          "Currency",
        exchangeCode: getOptionalString(quote, "exchange"),
      });

      seenProviderSymbols.add(providerSymbol);
    }

    return results;
  } catch (error) {
    console.error(`Failed to search forex for ${normalizedQuery}:`, error);
    return [];
  }
}

export async function resolveForexInstrument(
  providerSymbol: string,
): Promise<ForexResolvedInstrument | null> {
  return getForexChartSnapshot(providerSymbol);
}

export async function getForexMarketPrice(
  providerSymbol: string,
): Promise<MarketPriceItem | null> {
  const snapshot = await getForexChartSnapshot(providerSymbol);

  if (!snapshot || snapshot.price === null) {
    return null;
  }

  return {
    symbol: snapshot.providerSymbol,
    price: snapshot.price,
    currency: snapshot.currency,
    source: "yahoo",
    asOf: snapshot.asOf,
  };
}
