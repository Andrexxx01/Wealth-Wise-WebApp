import { z } from "zod";

export const expenseApiSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  spentAt: z.string().min(1, "Spent date is required"),
  notes: z.string().optional().nullable(),
});
