import { z } from "zod";

export const createIncomeSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(80, "Title must be less than 80 characters."),

  category: z.enum([
    "SALARY",
    "FREELANCE",
    "BUSINESS",
    "INVESTMENT_RETURN",
    "BONUS",
    "GIFT",
    "OTHER",
  ]),

  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine((value) => Number(value) > 0, {
      message: "Amount must be greater than 0.",
    }),

  receivedAt: z.string().min(1, "Received date is required."),

  frequency: z.enum(["ONE_TIME", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),

  notes: z
    .string()
    .max(200, "Notes must be less than 200 characters.")
    .optional(),
});
