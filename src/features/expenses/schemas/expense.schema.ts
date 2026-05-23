import { z } from "zod";
import {
  EXPENSE_CATEGORY_VALUES,
  EXPENSE_TYPE_VALUES,
} from "@/constants/finance-options";

export const createExpenseSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(80, "Title must be less than 80 characters."),

  category: z.enum(EXPENSE_CATEGORY_VALUES),

  type: z.enum(EXPENSE_TYPE_VALUES),

  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine((value) => Number(value) > 0, {
      message: "Amount must be greater than 0.",
    }),

  spentAt: z.string().min(1, "Spent date is required."),

  notes: z
    .string()
    .max(200, "Notes must be less than 200 characters.")
    .optional(),
});
