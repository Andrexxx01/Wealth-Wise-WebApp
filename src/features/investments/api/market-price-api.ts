import type { MarketPriceData } from "@/types/market-price";

type MarketPriceResponse = {
  data: MarketPriceData;
};

export async function getMarketPrices(
  symbols: string[],
): Promise<MarketPriceData> {
  if (symbols.length === 0) {
    return {
      prices: {},
      quoteCurrency: "USD",
      asOf: new Date().toISOString(),
    };
  }

  const searchParams = new URLSearchParams({
    symbols: symbols.join(","),
  });

  const response = await fetch(`/api/market-prices?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to load market prices.");
  }

  const result: MarketPriceResponse = await response.json();

  return result.data;
}
