import type { MarketPriceItem } from "@/types/market-price";

const MARKET_PRICE_REVALIDATE_SECONDS = 60 * 60 * 24;

export async function getCryptoSpotPrice(
  symbol: string,
): Promise<MarketPriceItem | null> {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.coinbase.com/v2/prices/${normalizedSymbol}-USD/spot`,
      {
        next: {
          revalidate: MARKET_PRICE_REVALIDATE_SECONDS,
        },
      },
    );

    if (!response.ok) {
      console.error(
        `Coinbase returned ${response.status} for ${normalizedSymbol}-USD`,
      );

      return null;
    }

    const result: unknown = await response.json();

    if (
      typeof result !== "object" ||
      result === null ||
      !("data" in result) ||
      typeof result.data !== "object" ||
      result.data === null ||
      !("amount" in result.data) ||
      typeof result.data.amount !== "string"
    ) {
      return null;
    }

    const price = Number(result.data.amount);

    if (!Number.isFinite(price) || price <= 0) {
      return null;
    }

    return {
      symbol: normalizedSymbol,
      price,
      currency: "USD",
      source: "coinbase",
    };
  } catch (error) {
    console.error(
      `Failed to load market price for ${normalizedSymbol}:`,
      error,
    );

    return null;
  }
}
