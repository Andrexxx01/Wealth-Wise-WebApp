export type ForexSearchResultItem = {
  providerSymbol: string;
  pair: string;
  symbol: string;
  name: string;
  baseCurrency: string;
  quoteCurrency: string;
  exchange: string;
  exchangeCode: string | null;
};

export type ForexResolvedInstrument = ForexSearchResultItem & {
  currency: string;
  price: number | null;
  asOf: string | null;
};
