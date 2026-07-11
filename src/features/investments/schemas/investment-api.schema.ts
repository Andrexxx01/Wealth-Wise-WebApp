import { z } from "zod";

export const investmentApiSchema = z.object({
  assetName: z.string().min(1, "Asset name is required"),
  category: z.string().min(1, "Category is required"),
  investedAmount: z.coerce
    .number()
    .positive("Invested amount must be greater than 0"),
  currentValue: z.coerce.number().min(0, "Current value cannot be negative"),
  investedAt: z.string().min(1, "Invested date is required"),
  notes: z.string().optional().nullable(),
});
