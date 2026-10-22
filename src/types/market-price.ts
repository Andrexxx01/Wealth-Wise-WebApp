export type MarketPriceSource = "coinbase" | "yahoo";

export type MarketPriceItem = {
  symbol: string;
  price: number;
  currency: string;
  source: MarketPriceSource;
  asOf: string | null;
};

export type MarketPriceData = {
  prices: Record<string, MarketPriceItem | null>;
  quoteCurrency: string;
  asOf: string;
};
