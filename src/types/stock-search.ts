export type StockSearchResultItem = {
  providerSymbol: string;
  symbol: string;
  name: string;
  exchange: string;
  exchangeCode: string | null;
};

export type StockResolvedInstrument = StockSearchResultItem & {
  currency: string;
  price: number | null;
  asOf: string | null;
};
