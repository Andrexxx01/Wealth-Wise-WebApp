import type {
  InvestmentAssetCategory,
  InvestmentInstrumentType,
  InvestmentTransactionType,
  InvestmentValuationType,
} from "@/types/investment-v2";

export type InvestmentV2DialogMode = "NEW_ASSET" | "EXISTING_ASSET_TRANSACTION";

export type CreateInvestmentAssetV2FormValues = {
  name: string;

  category: InvestmentAssetCategory;
  instrumentType: InvestmentInstrumentType;
  valuationType: InvestmentValuationType;

  symbol: string;
  exchange: string;
  isin: string;
  issuer: string;
  underlyingIndex: string;

  unit: string;
  pricingUnit: string;

  marketCurrencyCode: string;

  annualInterestRate: string;
  couponRate: string;
  faceValue: string;
  maturityDate: string;

  assetNotes: string;

  initialTransactionType: "BUY" | "OPEN";

  quantity: string;

  grossAmount: string;
  feeAmount: string;

  currencyCode: string;

  transactedAt: string;

  transactionNotes: string;
};

export type CreateInvestmentTransactionV2FormValues = {
  assetId: string;

  type: InvestmentTransactionType;

  quantity: string;

  grossAmount: string;
  feeAmount: string;

  currencyCode: string;

  transactedAt: string;

  notes: string;
};

export type EditInvestmentAssetV2FormValues = {
  name: string;

  exchange: string;
  isin: string;
  issuer: string;
  underlyingIndex: string;

  notes: string;
};

export type InvestmentEventV2FormType = "INTEREST" | "COUPON" | "MATURITY";

export type CreateInvestmentEventV2FormValues = {
  type: InvestmentEventV2FormType;

  grossAmount: string;
  feeAmount: string;
  taxAmount: string;

  currencyCode: string;

  occurredAt: string;

  notes: string;
};