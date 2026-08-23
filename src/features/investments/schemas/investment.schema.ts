import { z } from "zod";
import { INVESTMENT_CATEGORY_VALUES } from "@/constants/finance-options";

export const createInvestmentSchema = z.object({
  assetName: z
    .string()
    .min(2, "Asset name must be at least 2 characters.")
    .max(80, "Asset name must be less than 80 characters."),

  category: z.enum(INVESTMENT_CATEGORY_VALUES),

  investedAmount: z
    .string()
    .min(1, "Invested amount is required.")
    .refine((value) => Number(value) > 0, {
      message: "Invested amount must be greater than 0.",
    }),

  currency: z.enum(["USD", "IDR"]),

  investedAt: z.string().min(1, "Investment date is required."),

  notes: z
    .string()
    .max(200, "Notes must be less than 200 characters.")
    .optional(),

  symbol: z
    .string()
    .trim()
    .min(1, "Symbol is required.")
    .max(20, "Symbol must be 20 characters or fewer."),
    
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) > 0,
      "Quantity must be greater than 0",
    ),

  feeAmount: z
    .string()
    .refine(
      (value) =>
        value.trim() !== "" &&
        Number.isFinite(Number(value)) &&
        Number(value) >= 0,
      "Fee cannot be negative",
    ),
});
