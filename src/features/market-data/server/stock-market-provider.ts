import type { MarketPriceItem } from "@/types/market-price";

const MARKET_PRICE_REVALIDATE_SECONDS = 60 * 5;

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

export async function getStockMarketPrice(
  symbol: string,
): Promise<MarketPriceItem | null> {
  const normalizedSymbol = symbol.trim().toUpperCase();

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

    const currency =
      "currency" in meta && typeof meta.currency === "string"
        ? meta.currency.trim().toUpperCase()
        : "";

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

    if (price === null) {
      return null;
    }

    const regularMarketTime =
      "regularMarketTime" in meta &&
      typeof meta.regularMarketTime === "number" &&
      Number.isFinite(meta.regularMarketTime)
        ? meta.regularMarketTime
        : null;

    const asOf =
      regularMarketTime !== null
        ? new Date(regularMarketTime * 1000).toISOString()
        : new Date().toISOString();

    return {
      symbol: normalizedSymbol,
      price,
      currency,
      source: "yahoo",
      asOf,
    };
  } catch (error) {
    console.error(
      `Failed to load stock market price for ${normalizedSymbol}:`,
      error,
    );

    return null;
  }
}
