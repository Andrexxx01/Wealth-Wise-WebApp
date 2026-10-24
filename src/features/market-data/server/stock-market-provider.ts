import type { MarketPriceItem } from "@/types/market-price";
import type {
  StockResolvedInstrument,
  StockSearchResultItem,
} from "@/types/stock-search";

const MARKET_PRICE_REVALIDATE_SECONDS = 60 * 5;
const STOCK_SEARCH_REVALIDATE_SECONDS = 60 * 10;

const YAHOO_MARKET_SUFFIXES = new Set([
  "AX",
  "BO",
  "BR",
  "CO",
  "DE",
  "F",
  "HE",
  "HK",
  "IR",
  "JK",
  "KQ",
  "KS",
  "L",
  "MC",
  "MI",
  "NS",
  "OL",
  "PA",
  "SI",
  "ST",
  "SW",
  "T",
  "TA",
  "TO",
  "V",
]);

type StockChartSnapshot = {
  providerSymbol: string;
  symbol: string;
  name: string;
  exchange: string;
  exchangeCode: string | null;
  currency: string;
  price: number | null;
  asOf: string | null;
};

function getDisplayStockSymbol(providerSymbol: string) {
  const normalizedSymbol = providerSymbol.trim().toUpperCase();
  const separatorIndex = normalizedSymbol.lastIndexOf(".");

  if (separatorIndex <= 0) {
    return normalizedSymbol;
  }

  const suffix = normalizedSymbol.slice(separatorIndex + 1);

  if (!YAHOO_MARKET_SUFFIXES.has(suffix)) {
    return normalizedSymbol;
  }

  return normalizedSymbol.slice(0, separatorIndex);
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

function getOptionalString(
  value: object,
  key: string,
): string | null {
  if (!(key in value)) {
    return null;
  }

  const candidate = (value as Record<string, unknown>)[key];

  return typeof candidate === "string" && candidate.trim()
    ? candidate.trim()
    : null;
}

async function getStockChartSnapshot(
  providerSymbol: string,
): Promise<StockChartSnapshot | null> {
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
        `Yahoo Finance returned ${response.status} for ${normalizedSymbol}`,
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

    const currency = getOptionalString(meta, "currency")?.toUpperCase() ?? "";

    if (!currency) {
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

    const latestClose = getLatestClose(result);

    const price = regularMarketPrice ?? latestClose ?? chartPreviousClose;

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

    const resolvedProviderSymbol =
      getOptionalString(meta, "symbol")?.toUpperCase() ?? normalizedSymbol;

    const name =
      getOptionalString(meta, "longName") ??
      getOptionalString(meta, "shortName") ??
      resolvedProviderSymbol;

    const exchange =
      getOptionalString(meta, "fullExchangeName") ??
      getOptionalString(meta, "exchangeName") ??
      "Unknown exchange";

    const exchangeCode = getOptionalString(meta, "exchangeName");

    return {
      providerSymbol: resolvedProviderSymbol,
      symbol: getDisplayStockSymbol(resolvedProviderSymbol),
      name,
      exchange,
      exchangeCode,
      currency,
      price,
      asOf,
    };
  } catch (error) {
    console.error(
      `Failed to load stock metadata for ${normalizedSymbol}:`,
      error,
    );

    return null;
  }
}

export async function searchStocks(
  query: string,
): Promise<StockSearchResultItem[]> {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
        normalizedQuery,
      )}&quotesCount=8&newsCount=0&listsCount=0&enableFuzzyQuery=true`,
      {
        next: {
          revalidate: STOCK_SEARCH_REVALIDATE_SECONDS,
        },
      },
    );

    if (!response.ok) {
      console.error(`Yahoo Finance search returned ${response.status}.`);

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

    const results: StockSearchResultItem[] = [];

    for (const quote of payload.quotes) {
      if (typeof quote !== "object" || quote === null) {
        continue;
      }

      const quoteType = getOptionalString(quote, "quoteType")?.toUpperCase();

      if (quoteType !== "EQUITY") {
        continue;
      }

      const providerSymbol = getOptionalString(quote, "symbol")?.toUpperCase();

      if (!providerSymbol) {
        continue;
      }

      const name =
        getOptionalString(quote, "longname") ??
        getOptionalString(quote, "shortname") ??
        providerSymbol;

      const exchange =
        getOptionalString(quote, "exchDisp") ??
        getOptionalString(quote, "exchange") ??
        "Unknown exchange";

      const exchangeCode = getOptionalString(quote, "exchange");

      results.push({
        providerSymbol,
        symbol: getDisplayStockSymbol(providerSymbol),
        name,
        exchange,
        exchangeCode,
      });
    }

    return results;
  } catch (error) {
    console.error(`Failed to search stocks for ${normalizedQuery}:`, error);

    return [];
  }
}

export async function resolveStockInstrument(
  providerSymbol: string,
): Promise<StockResolvedInstrument | null> {
  return getStockChartSnapshot(providerSymbol);
}

export async function getStockMarketPrice(
  providerSymbol: string,
): Promise<MarketPriceItem | null> {
  const snapshot = await getStockChartSnapshot(providerSymbol);

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
