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
