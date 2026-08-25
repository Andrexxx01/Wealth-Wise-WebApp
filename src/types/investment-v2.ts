export type InvestmentAssetCategory =
  | "CRYPTO"
  | "STOCK"
  | "DEPOSIT"
  | "INDEX"
  | "BOND"
  | "MUTUAL_FUND"
  | "FOREX"
  | "COMMODITY";

export type InvestmentInstrumentType =
  | "CRYPTO_ASSET"
  | "COMMON_STOCK"
  | "ETF"
  | "DEPOSIT"
  | "BOND"
  | "OPEN_END_FUND"
  | "INDEX_FUND"
  | "FOREIGN_CURRENCY"
  | "PHYSICAL_COMMODITY"
  | "OTHER";

export type InvestmentValuationType =
  | "MARKET_PRICE"
  | "NAV"
  | "FX_RATE"
  | "ACCRUAL"
  | "MANUAL";

export type InvestmentTransactionType = "BUY" | "SELL" | "OPEN" | "CLOSE";

export type InvestmentEventType =
  | "DIVIDEND"
  | "INTEREST"
  | "COUPON"
  | "DISTRIBUTION"
  | "MATURITY"
  | "PRINCIPAL_RETURN";

export interface InvestmentAssetItem {
  id: string;
  userId: string;

  name: string;
  category: InvestmentAssetCategory;
  instrumentType: InvestmentInstrumentType;
  valuationType: InvestmentValuationType;

  symbol: string | null;
  exchange: string | null;
  isin: string | null;
  issuer: string | null;
  underlyingIndex: string | null;

  unit: string | null;
  pricingUnit: string | null;

  marketCurrencyCode: string | null;

  annualInterestRate: number | null;
  couponRate: number | null;
  faceValue: number | null;
  maturityDate: string | null;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface InvestmentTransactionItem {
  id: string;

  userId: string;
  assetId: string;

  type: InvestmentTransactionType;

  quantity: number | null;

  grossAmount: number;
  feeAmount: number;

  currencyCode: string;

  transactedAt: string;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface InvestmentEventItem {
  id: string;

  userId: string;
  assetId: string;

  type: InvestmentEventType;

  grossAmount: number | null;
  feeAmount: number;
  taxAmount: number;

  currencyCode: string | null;

  occurredAt: string;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface InvestmentAssetWithTransactionsItem extends InvestmentAssetItem {
  transactions: InvestmentTransactionItem[];
  events: InvestmentEventItem[];
}
