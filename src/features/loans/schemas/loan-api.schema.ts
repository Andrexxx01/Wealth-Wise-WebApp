import { z } from "zod";

export const loanApiSchema = z.object({
  title: z.string().min(1, "Title is required"),
  lenderName: z.string().min(1, "Lender name is required"),
  category: z.string().min(1, "Category is required"),
  principalAmount: z.coerce
    .number()
    .positive("Principal amount must be greater than 0"),
  remainingBalance: z.coerce
    .number()
    .min(0, "Remaining balance cannot be negative"),
  monthlyPayment: z.coerce
    .number()
    .positive("Monthly payment must be greater than 0"),
  interestRate: z.coerce.number().min(0).optional().nullable(),
  dueDate: z.string().optional().nullable(),
  status: z.string().min(1, "Status is required").default("ACTIVE"),
});
