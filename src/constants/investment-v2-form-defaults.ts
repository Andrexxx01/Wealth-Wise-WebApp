import {
  INVESTMENT_V2_CATEGORY_CONFIG,
  getInvestmentV2InstrumentConfig,
} from "@/constants/investment-v2-form-options";

import type {
  CreateInvestmentAssetV2FormValues,
  CreateInvestmentTransactionV2FormValues,
} from "@/types/investment-v2-form";

function getLocalDateInputValue() {
  const now = new Date();

  const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;

  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function getDefaultInvestmentAssetV2FormValues(
  transactionCurrencyCode = "USD",
): CreateInvestmentAssetV2FormValues {
  const category = "CRYPTO" as const;

  const categoryConfig = INVESTMENT_V2_CATEGORY_CONFIG[category];

  const instrumentType = categoryConfig.defaultInstrumentType;

  const instrumentConfig = getInvestmentV2InstrumentConfig(
    category,
    instrumentType,
  );

  if (!instrumentConfig) {
    throw new Error(
      "Default investment instrument configuration was not found.",
    );
  }

  return {
    name: "",

    category,

    instrumentType,

    valuationType: instrumentConfig.valuationType,

    symbol: "",
    exchange: "",
    isin: "",
    issuer: "",
    underlyingIndex: "",

    unit: categoryConfig.defaultUnit,

    pricingUnit: categoryConfig.defaultPricingUnit,

    marketCurrencyCode: categoryConfig.defaultMarketCurrencyCode,

    annualInterestRate: "",
    couponRate: "",
    faceValue: "",
    maturityDate: "",

    assetNotes: "",

    initialTransactionType: categoryConfig.initialTransactionType,

    quantity: "",

    grossAmount: "",

    feeAmount: "0",

    currencyCode: transactionCurrencyCode,

    transactedAt: getLocalDateInputValue(),

    transactionNotes: "",
  };
}

export function getDefaultInvestmentTransactionV2FormValues(
  transactionCurrencyCode = "USD",
): CreateInvestmentTransactionV2FormValues {
  return {
    assetId: "",

    type: "BUY",

    quantity: "",

    grossAmount: "",

    feeAmount: "0",

    currencyCode: transactionCurrencyCode,

    transactedAt: getLocalDateInputValue(),

    notes: "",
  };
}
