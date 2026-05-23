import { z } from "zod";
import {
  INCOME_CATEGORY_VALUES,
  INCOME_FREQUENCY_VALUES,
} from "@/constants/finance-options";

export const createIncomeSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(80, "Title must be less than 80 characters."),

  category: z.enum(INCOME_CATEGORY_VALUES),

  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine((value) => Number(value) > 0, {
      message: "Amount must be greater than 0.",
    }),

  receivedAt: z.string().min(1, "Received date is required."),

  frequency: z.enum(INCOME_FREQUENCY_VALUES),

  notes: z
    .string()
    .max(200, "Notes must be less than 200 characters.")
    .optional(),
});
