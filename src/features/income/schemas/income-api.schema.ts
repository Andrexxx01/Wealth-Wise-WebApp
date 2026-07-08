import { z } from "zod";

export const incomeApiSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  receivedAt: z.string().min(1, "Received date is required"),
  frequency: z.string().min(1, "Frequency is required"),
  notes: z.string().optional().nullable(),
});
