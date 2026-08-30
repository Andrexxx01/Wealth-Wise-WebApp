import type {
  InvestmentAssetCategory,
  InvestmentInstrumentType,
  InvestmentValuationType,
} from "@/types/investment-v2";

type InvestmentV2InstrumentOption = {
  value: InvestmentInstrumentType;
  label: string;
  valuationType: InvestmentValuationType;
};

type InvestmentV2CategoryConfig = {
  label: string;

  instruments: InvestmentV2InstrumentOption[];

  defaultInstrumentType: InvestmentInstrumentType;

  initialTransactionType: "BUY" | "OPEN";

  defaultMarketCurrencyCode: string;

  defaultUnit: string;
  defaultPricingUnit: string;
};

export const INVESTMENT_V2_CATEGORY_OPTIONS: Array<{
  value: InvestmentAssetCategory;
  label: string;
}> = [
  {
    value: "CRYPTO",
    label: "Crypto",
  },
  {
    value: "STOCK",
    label: "Stock",
  },
  {
    value: "DEPOSIT",
    label: "Deposit",
  },
  {
    value: "INDEX",
    label: "Index",
  },
  {
    value: "BOND",
    label: "Bond",
  },
  {
    value: "MUTUAL_FUND",
    label: "Mutual Fund",
  },
  {
    value: "FOREX",
    label: "Foreign Currency",
  },
  {
    value: "COMMODITY",
    label: "Commodity",
  },
];

export const INVESTMENT_V2_CATEGORY_CONFIG: Record<
  InvestmentAssetCategory,
  InvestmentV2CategoryConfig
> = {
  CRYPTO: {
    label: "Crypto",

    instruments: [
      {
        value: "CRYPTO_ASSET",
        label: "Crypto Asset",
        valuationType: "MARKET_PRICE",
      },
    ],

    defaultInstrumentType: "CRYPTO_ASSET",

    initialTransactionType: "BUY",

    defaultMarketCurrencyCode: "USD",

    defaultUnit: "",
    defaultPricingUnit: "",
  },

  STOCK: {
    label: "Stock",

    instruments: [
      {
        value: "COMMON_STOCK",
        label: "Common Stock",
        valuationType: "MARKET_PRICE",
      },
    ],

    defaultInstrumentType: "COMMON_STOCK",

    initialTransactionType: "BUY",

    defaultMarketCurrencyCode: "",

    defaultUnit: "SHARE",

    defaultPricingUnit: "SHARE",
  },

  DEPOSIT: {
    label: "Deposit",

    instruments: [
      {
        value: "DEPOSIT",
        label: "Deposit",
        valuationType: "ACCRUAL",
      },
    ],

    defaultInstrumentType: "DEPOSIT",

    initialTransactionType: "OPEN",

    defaultMarketCurrencyCode: "",

    defaultUnit: "",

    defaultPricingUnit: "",
  },

  INDEX: {
    label: "Index",

    instruments: [
      {
        value: "ETF",
        label: "ETF",
        valuationType: "MARKET_PRICE",
      },
      {
        value: "INDEX_FUND",
        label: "Index Fund",
        valuationType: "NAV",
      },
    ],

    defaultInstrumentType: "ETF",

    initialTransactionType: "BUY",

    defaultMarketCurrencyCode: "",

    defaultUnit: "SHARE",

    defaultPricingUnit: "SHARE",
  },

  BOND: {
    label: "Bond",

    instruments: [
      {
        value: "BOND",
        label: "Bond",
        valuationType: "MANUAL",
      },
    ],

    defaultInstrumentType: "BOND",

    initialTransactionType: "BUY",

    defaultMarketCurrencyCode: "",

    defaultUnit: "UNIT",

    defaultPricingUnit: "UNIT",
  },

  MUTUAL_FUND: {
    label: "Mutual Fund",

    instruments: [
      {
        value: "OPEN_END_FUND",
        label: "Open-End Fund",
        valuationType: "NAV",
      },
    ],

    defaultInstrumentType: "OPEN_END_FUND",

    initialTransactionType: "BUY",

    defaultMarketCurrencyCode: "",

    defaultUnit: "UNIT",

    defaultPricingUnit: "UNIT",
  },

  FOREX: {
    label: "Foreign Currency",

    instruments: [
      {
        value: "FOREIGN_CURRENCY",
        label: "Foreign Currency",
        valuationType: "FX_RATE",
      },
    ],

    defaultInstrumentType: "FOREIGN_CURRENCY",

    initialTransactionType: "BUY",

    defaultMarketCurrencyCode: "",

    defaultUnit: "CURRENCY",

    defaultPricingUnit: "CURRENCY",
  },

  COMMODITY: {
    label: "Commodity",

    instruments: [
      {
        value: "PHYSICAL_COMMODITY",
        label: "Physical Commodity",
        valuationType: "MARKET_PRICE",
      },
      {
        value: "ETF",
        label: "Commodity ETF",
        valuationType: "MARKET_PRICE",
      },
    ],

    defaultInstrumentType: "PHYSICAL_COMMODITY",

    initialTransactionType: "BUY",

    defaultMarketCurrencyCode: "",

    defaultUnit: "",

    defaultPricingUnit: "",
  },
};

export function getInvestmentV2InstrumentOptions(
  category: InvestmentAssetCategory,
) {
  return INVESTMENT_V2_CATEGORY_CONFIG[category].instruments;
}

export function getInvestmentV2InstrumentConfig(
  category: InvestmentAssetCategory,
  instrumentType: InvestmentInstrumentType,
) {
  return (
    INVESTMENT_V2_CATEGORY_CONFIG[category].instruments.find(
      (instrument) => instrument.value === instrumentType,
    ) ?? null
  );
}