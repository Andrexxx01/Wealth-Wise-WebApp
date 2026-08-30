import { z } from "zod";

const investmentCategoryValues = [
  "CRYPTO",
  "STOCK",
  "DEPOSIT",
  "INDEX",
  "BOND",
  "MUTUAL_FUND",
  "FOREX",
  "COMMODITY",
] as const;

const investmentInstrumentTypeValues = [
  "CRYPTO_ASSET",
  "COMMON_STOCK",
  "ETF",
  "DEPOSIT",
  "BOND",
  "OPEN_END_FUND",
  "INDEX_FUND",
  "FOREIGN_CURRENCY",
  "PHYSICAL_COMMODITY",
  "OTHER",
] as const;

const investmentValuationTypeValues = [
  "MARKET_PRICE",
  "NAV",
  "FX_RATE",
  "ACCRUAL",
  "MANUAL",
] as const;

const investmentTransactionTypeValues = [
  "BUY",
  "SELL",
  "OPEN",
  "CLOSE",
] as const;

function isPositiveNumberString(value: string) {
  if (value.trim() === "") {
    return false;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0;
}

function isOptionalPositiveNumberString(value: string) {
  if (value.trim() === "") {
    return true;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0;
}

function isOptionalNonNegativeNumberString(value: string) {
  if (value.trim() === "") {
    return true;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue >= 0;
}

function isCurrencyCode(value: string) {
  return /^[A-Za-z]{3}$/.test(value.trim());
}

export const createInvestmentAssetV2FormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Asset name must be at least 2 characters.")
      .max(100, "Asset name must be 100 characters or fewer."),

    category: z.enum(investmentCategoryValues),

    instrumentType: z.enum(investmentInstrumentTypeValues),

    valuationType: z.enum(investmentValuationTypeValues),

    symbol: z.string().trim().max(30, "Symbol must be 30 characters or fewer."),

    exchange: z
      .string()
      .trim()
      .max(80, "Exchange must be 80 characters or fewer."),

    isin: z.string().trim().max(20, "ISIN must be 20 characters or fewer."),

    issuer: z
      .string()
      .trim()
      .max(100, "Issuer must be 100 characters or fewer."),

    underlyingIndex: z
      .string()
      .trim()
      .max(100, "Underlying index must be 100 characters or fewer."),

    unit: z.string().trim().max(30, "Unit must be 30 characters or fewer."),

    pricingUnit: z
      .string()
      .trim()
      .max(30, "Pricing unit must be 30 characters or fewer."),

    marketCurrencyCode: z
      .string()
      .trim()
      .refine((value) => value === "" || isCurrencyCode(value), {
        message: "Market currency must use a 3-letter currency code.",
      }),

    annualInterestRate: z.string().refine(isOptionalNonNegativeNumberString, {
      message: "Annual interest rate cannot be negative.",
    }),

    couponRate: z.string().refine(isOptionalNonNegativeNumberString, {
      message: "Coupon rate cannot be negative.",
    }),

    faceValue: z.string().refine(isOptionalPositiveNumberString, {
      message: "Face value must be greater than 0.",
    }),

    maturityDate: z.string(),

    assetNotes: z.string().max(500, "Notes must be 500 characters or fewer."),

    initialTransactionType: z.enum(["BUY", "OPEN"]),

    quantity: z.string().refine(isOptionalPositiveNumberString, {
      message: "Quantity must be greater than 0.",
    }),

    grossAmount: z.string().refine(isPositiveNumberString, {
      message: "Transaction amount must be greater than 0.",
    }),

    feeAmount: z.string().refine(isOptionalNonNegativeNumberString, {
      message: "Fee cannot be negative.",
    }),

    currencyCode: z.string().trim().refine(isCurrencyCode, {
      message: "Transaction currency must use a 3-letter currency code.",
    }),

    transactedAt: z.string().min(1, "Transaction date is required."),

    transactionNotes: z
      .string()
      .max(500, "Transaction notes must be 500 characters or fewer."),
  })
  .superRefine((data, ctx) => {
    // ===============================================
    // QUANTITY VS PRINCIPAL
    // ===============================================

    if (data.initialTransactionType === "BUY" && data.quantity.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Quantity is required for BUY transactions.",
      });
    }

    if (data.initialTransactionType === "OPEN" && data.quantity.trim() !== "") {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Quantity must be empty for OPEN transactions.",
      });
    }

    // ===============================================
    // CRYPTO
    // ===============================================

    if (data.category === "CRYPTO") {
      if (data.instrumentType !== "CRYPTO_ASSET") {
        ctx.addIssue({
          code: "custom",
          path: ["instrumentType"],
          message: "Crypto category must use the Crypto Asset instrument type.",
        });
      }

      if (data.valuationType !== "MARKET_PRICE") {
        ctx.addIssue({
          code: "custom",
          path: ["valuationType"],
          message: "Crypto assets must use market price valuation.",
        });
      }

      if (data.symbol.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["symbol"],
          message: "Symbol is required for crypto assets.",
        });
      }

      if (data.initialTransactionType !== "BUY") {
        ctx.addIssue({
          code: "custom",
          path: ["initialTransactionType"],
          message: "Crypto assets must start with a BUY transaction.",
        });
      }
    }

    // ===============================================
    // STOCK
    // ===============================================

    if (data.category === "STOCK") {
      if (data.instrumentType !== "COMMON_STOCK") {
        ctx.addIssue({
          code: "custom",
          path: ["instrumentType"],
          message: "Stock category must use the Common Stock instrument type.",
        });
      }

      if (data.valuationType !== "MARKET_PRICE") {
        ctx.addIssue({
          code: "custom",
          path: ["valuationType"],
          message: "Common stocks must use market price valuation.",
        });
      }

      if (data.symbol.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["symbol"],
          message: "Symbol is required for stocks.",
        });
      }

      if (data.initialTransactionType !== "BUY") {
        ctx.addIssue({
          code: "custom",
          path: ["initialTransactionType"],
          message: "Stocks must start with a BUY transaction.",
        });
      }
    }

    // ===============================================
    // DEPOSIT
    // ===============================================

    if (data.category === "DEPOSIT") {
      if (data.instrumentType !== "DEPOSIT") {
        ctx.addIssue({
          code: "custom",
          path: ["instrumentType"],
          message: "Deposit category must use the Deposit instrument type.",
        });
      }

      if (data.valuationType !== "ACCRUAL") {
        ctx.addIssue({
          code: "custom",
          path: ["valuationType"],
          message: "Deposits must use accrual valuation.",
        });
      }

      if (data.initialTransactionType !== "OPEN") {
        ctx.addIssue({
          code: "custom",
          path: ["initialTransactionType"],
          message: "Deposits must start with an OPEN transaction.",
        });
      }
    }

    // ===============================================
    // INDEX
    // ===============================================

    if (data.category === "INDEX") {
      const validInstrument =
        data.instrumentType === "ETF" || data.instrumentType === "INDEX_FUND";

      if (!validInstrument) {
        ctx.addIssue({
          code: "custom",
          path: ["instrumentType"],
          message: "Index investments must use ETF or Index Fund.",
        });
      }

      if (
        data.instrumentType === "ETF" &&
        data.valuationType !== "MARKET_PRICE"
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["valuationType"],
          message: "Index ETFs must use market price valuation.",
        });
      }

      if (
        data.instrumentType === "INDEX_FUND" &&
        data.valuationType !== "NAV"
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["valuationType"],
          message: "Index funds must use NAV valuation.",
        });
      }

      if (data.instrumentType === "ETF" && data.symbol.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["symbol"],
          message: "Symbol is required for ETFs.",
        });
      }
    }

    // ===============================================
    // BOND
    // ===============================================

    if (data.category === "BOND") {
      if (data.instrumentType !== "BOND") {
        ctx.addIssue({
          code: "custom",
          path: ["instrumentType"],
          message: "Bond category must use the Bond instrument type.",
        });
      }

      if (
        data.valuationType !== "MARKET_PRICE" &&
        data.valuationType !== "MANUAL"
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["valuationType"],
          message: "Bonds must use market price or manual valuation.",
        });
      }

      if (data.initialTransactionType !== "BUY") {
        ctx.addIssue({
          code: "custom",
          path: ["initialTransactionType"],
          message: "Bonds must start with a BUY transaction.",
        });
      }
    }

    // ===============================================
    // MUTUAL FUND
    // ===============================================

    if (data.category === "MUTUAL_FUND") {
      if (data.instrumentType !== "OPEN_END_FUND") {
        ctx.addIssue({
          code: "custom",
          path: ["instrumentType"],
          message: "Mutual funds must use the Open-End Fund instrument type.",
        });
      }

      if (data.valuationType !== "NAV") {
        ctx.addIssue({
          code: "custom",
          path: ["valuationType"],
          message: "Mutual funds must use NAV valuation.",
        });
      }

      if (data.initialTransactionType !== "BUY") {
        ctx.addIssue({
          code: "custom",
          path: ["initialTransactionType"],
          message: "Mutual funds must start with a BUY transaction.",
        });
      }
    }

    // ===============================================
    // FOREX HOLDING
    // ===============================================

    if (data.category === "FOREX") {
      if (data.instrumentType !== "FOREIGN_CURRENCY") {
        ctx.addIssue({
          code: "custom",
          path: ["instrumentType"],
          message:
            "Forex holdings must use the Foreign Currency instrument type.",
        });
      }

      if (data.valuationType !== "FX_RATE") {
        ctx.addIssue({
          code: "custom",
          path: ["valuationType"],
          message: "Foreign currency holdings must use FX rate valuation.",
        });
      }

      if (data.initialTransactionType !== "BUY") {
        ctx.addIssue({
          code: "custom",
          path: ["initialTransactionType"],
          message:
            "Foreign currency holdings must start with a BUY transaction.",
        });
      }
    }

    // ===============================================
    // COMMODITY
    // ===============================================

    if (data.category === "COMMODITY") {
      const validInstrument =
        data.instrumentType === "PHYSICAL_COMMODITY" ||
        data.instrumentType === "ETF";

      if (!validInstrument) {
        ctx.addIssue({
          code: "custom",
          path: ["instrumentType"],
          message: "Commodity investments must use Physical Commodity or ETF.",
        });
      }

      if (data.valuationType !== "MARKET_PRICE") {
        ctx.addIssue({
          code: "custom",
          path: ["valuationType"],
          message: "Commodity investments must use market price valuation.",
        });
      }

      if (data.instrumentType === "ETF" && data.symbol.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["symbol"],
          message: "Symbol is required for commodity ETFs.",
        });
      }

      if (data.initialTransactionType !== "BUY") {
        ctx.addIssue({
          code: "custom",
          path: ["initialTransactionType"],
          message: "Commodity investments must start with a BUY transaction.",
        });
      }
    }
  });

export const createInvestmentTransactionV2FormSchema = z
  .object({
    assetId: z.string().min(1, "Investment asset is required."),

    type: z.enum(investmentTransactionTypeValues),

    quantity: z.string().refine(isOptionalPositiveNumberString, {
      message: "Quantity must be greater than 0.",
    }),

    grossAmount: z.string().refine(isPositiveNumberString, {
      message: "Transaction amount must be greater than 0.",
    }),

    feeAmount: z.string().refine(isOptionalNonNegativeNumberString, {
      message: "Fee cannot be negative.",
    }),

    currencyCode: z.string().trim().refine(isCurrencyCode, {
      message: "Currency must use a 3-letter currency code.",
    }),

    transactedAt: z.string().min(1, "Transaction date is required."),

    notes: z.string().max(500, "Notes must be 500 characters or fewer."),
  })
  .superRefine((data, ctx) => {
    const requiresQuantity = data.type === "BUY" || data.type === "SELL";

    const forbidsQuantity = data.type === "OPEN" || data.type === "CLOSE";

    if (requiresQuantity && data.quantity.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Quantity is required for BUY and SELL transactions.",
      });
    }

    if (forbidsQuantity && data.quantity.trim() !== "") {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Quantity must be empty for OPEN and CLOSE transactions.",
      });
    }
  });
