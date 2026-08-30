import { z } from "zod";

const currencyCodeSchema = z
  .string()
  .trim()
  .length(3, "Currency code must contain exactly 3 characters.")
  .transform((value) => value.toUpperCase());

const optionalTextSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => {
    if (!value) {
      return null;
    }

    return value;
  });

export const createInvestmentAssetV2Schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Asset name must be at least 2 characters.")
      .max(100, "Asset name must be 100 characters or fewer."),

    category: z.enum([
      "CRYPTO",
      "STOCK",
      "DEPOSIT",
      "INDEX",
      "BOND",
      "MUTUAL_FUND",
      "FOREX",
      "COMMODITY",
    ]),

    instrumentType: z.enum([
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
    ]),

    valuationType: z.enum([
      "MARKET_PRICE",
      "NAV",
      "FX_RATE",
      "ACCRUAL",
      "MANUAL",
    ]),

    symbol: optionalTextSchema,
    exchange: optionalTextSchema,
    isin: optionalTextSchema,
    issuer: optionalTextSchema,
    underlyingIndex: optionalTextSchema,

    unit: optionalTextSchema,
    pricingUnit: optionalTextSchema,

    marketCurrencyCode: currencyCodeSchema.optional().nullable(),

    annualInterestRate: z.coerce
      .number()
      .finite()
      .nonnegative()
      .optional()
      .nullable(),

    couponRate: z.coerce.number().finite().nonnegative().optional().nullable(),

    faceValue: z.coerce.number().finite().positive().optional().nullable(),

    maturityDate: z.string().datetime().optional().nullable(),

    notes: z.string().trim().max(500).optional().nullable(),

    initialTransaction: z.object({
      type: z.enum(["BUY", "OPEN"]),

      quantity: z.coerce.number().finite().positive().optional().nullable(),

      grossAmount: z.coerce.number().finite().positive(),

      feeAmount: z.coerce.number().finite().nonnegative().default(0),

      currencyCode: currencyCodeSchema,

      transactedAt: z.string().datetime(),

      notes: z.string().trim().max(500).optional().nullable(),
    }),
  })
  .superRefine((data, ctx) => {
    const isQuantityTransaction = data.initialTransaction.type === "BUY";

    const isPrincipalTransaction = data.initialTransaction.type === "OPEN";

    if (isQuantityTransaction && data.initialTransaction.quantity === null) {
      ctx.addIssue({
        code: "custom",
        path: ["initialTransaction", "quantity"],
        message: "Quantity is required for BUY transactions.",
      });
    }

    if (
      isPrincipalTransaction &&
      data.initialTransaction.quantity !== null &&
      data.initialTransaction.quantity !== undefined
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["initialTransaction", "quantity"],
        message: "Quantity must not be provided for OPEN transactions.",
      });
    }

    if (
      data.instrumentType === "DEPOSIT" &&
      data.initialTransaction.type !== "OPEN"
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["initialTransaction", "type"],
        message: "Deposit assets must start with an OPEN transaction.",
      });
    }

    if (data.instrumentType === "DEPOSIT" && data.valuationType !== "ACCRUAL") {
      ctx.addIssue({
        code: "custom",
        path: ["valuationType"],
        message: "Deposit assets must use ACCRUAL valuation.",
      });
    }

    if (data.instrumentType === "CRYPTO_ASSET" && !data.symbol) {
      ctx.addIssue({
        code: "custom",
        path: ["symbol"],
        message: "Symbol is required for crypto assets.",
      });
    }

    if (data.instrumentType === "COMMON_STOCK" && !data.symbol) {
      ctx.addIssue({
        code: "custom",
        path: ["symbol"],
        message: "Symbol is required for common stocks.",
      });
    }

    if (data.instrumentType === "ETF" && !data.symbol) {
      ctx.addIssue({
        code: "custom",
        path: ["symbol"],
        message: "Symbol is required for ETFs.",
      });
    }
  });

export type CreateInvestmentAssetV2Input = z.infer<
  typeof createInvestmentAssetV2Schema
>;

export const createInvestmentTransactionV2Schema = z
  .object({
    type: z.enum(["BUY", "SELL", "OPEN", "CLOSE"]),

    quantity: z.coerce.number().finite().positive().optional().nullable(),

    grossAmount: z.coerce.number().finite().positive(),

    feeAmount: z.coerce.number().finite().nonnegative().default(0),

    currencyCode: currencyCodeSchema,

    transactedAt: z.string().datetime(),

    notes: z.string().trim().max(500).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const requiresQuantity = data.type === "BUY" || data.type === "SELL";

    const forbidsQuantity = data.type === "OPEN" || data.type === "CLOSE";

    if (
      requiresQuantity &&
      (data.quantity === null || data.quantity === undefined)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Quantity is required for BUY and SELL transactions.",
      });
    }

    if (
      forbidsQuantity &&
      data.quantity !== null &&
      data.quantity !== undefined
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message:
          "Quantity must not be provided for OPEN and CLOSE transactions.",
      });
    }
  });

export type CreateInvestmentTransactionV2Input = z.infer<
  typeof createInvestmentTransactionV2Schema
>;