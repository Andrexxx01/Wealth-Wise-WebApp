import { z } from "zod";

export const investmentApiSchema = z.object({
  assetName: z.string().min(1, "Asset name is required"),
  category: z.string().min(1, "Category is required"),
  investedAmount: z.coerce
    .number()
    .positive("Invested amount must be greater than 0"),
  currency: z.enum(["USD", "IDR"]),
  investedAt: z.string().min(1, "Invested date is required"),
  notes: z.string().optional().nullable(),
  symbol: z
    .string()
    .trim()
    .min(1, "Symbol is required.")
    .max(20, "Symbol must be 20 characters or fewer."),

  quantity: z.coerce.number().positive("Quantity must be greater than 0"),

  feeAmount: z.coerce.number().min(0, "Fee cannot be negative"),
});
