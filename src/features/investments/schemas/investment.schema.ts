import { z } from "zod";

export const createInvestmentSchema = z.object({
  assetName: z
    .string()
    .min(2, "Asset name must be at least 2 characters.")
    .max(80, "Asset name must be less than 80 characters."),

  category: z.enum([
    "STOCK",
    "CRYPTO",
    "MUTUAL_FUND",
    "BOND",
    "GOLD",
    "PROPERTY",
    "CASH",
    "OTHER",
  ]),

  investedAmount: z
    .string()
    .min(1, "Invested amount is required.")
    .refine((value) => Number(value) > 0, {
      message: "Invested amount must be greater than 0.",
    }),

  currentValue: z
    .string()
    .min(1, "Current value is required.")
    .refine((value) => Number(value) >= 0, {
      message: "Current value must be 0 or greater.",
    }),

  investedAt: z.string().min(1, "Investment date is required."),

  notes: z
    .string()
    .max(200, "Notes must be less than 200 characters.")
    .optional(),
});
