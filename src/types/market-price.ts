export type MarketPriceItem = {
  symbol: string;
  price: number;
  currency: "USD";
  source: "coinbase";
};

export type MarketPriceData = {
  prices: Record<string, MarketPriceItem | null>;
  quoteCurrency: "USD";
  asOf: string;
};
