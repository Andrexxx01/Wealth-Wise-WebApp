import { z } from "zod";
import { LOAN_CATEGORY_VALUES } from "@/constants/finance-options";

export const createLoanSchema = z
  .object({
    title: z
      .string()
      .min(2, "Loan title must be at least 2 characters.")
      .max(80, "Loan title must be less than 80 characters."),

    lenderName: z
      .string()
      .min(2, "Lender name must be at least 2 characters.")
      .max(80, "Lender name must be less than 80 characters."),

    category: z.enum(LOAN_CATEGORY_VALUES),

    principalAmount: z
      .string()
      .min(1, "Principal amount is required.")
      .refine((value) => Number(value) > 0, {
        message: "Principal amount must be greater than 0.",
      }),

    remainingBalance: z
      .string()
      .min(1, "Remaining balance is required.")
      .refine((value) => Number(value) >= 0, {
        message: "Remaining balance must be 0 or greater.",
      }),

    monthlyPayment: z
      .string()
      .min(1, "Monthly payment is required.")
      .refine((value) => Number(value) > 0, {
        message: "Monthly payment must be greater than 0.",
      }),

    currency: z.enum(["USD", "IDR"]),

    interestRate: z
      .string()
      .optional()
      .refine((value) => !value || Number(value) >= 0, {
        message: "Interest rate must be 0 or greater.",
      }),

    dueDate: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const principalAmount = Number(values.principalAmount);
    const remainingBalance = Number(values.remainingBalance);
    const monthlyPayment = Number(values.monthlyPayment);

    if (
      Number.isFinite(principalAmount) &&
      Number.isFinite(remainingBalance) &&
      remainingBalance > principalAmount
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["remainingBalance"],
        message: "Remaining balance cannot be greater than principal amount.",
      });
    }

    if (
      Number.isFinite(monthlyPayment) &&
      Number.isFinite(remainingBalance) &&
      monthlyPayment > remainingBalance
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["monthlyPayment"],
        message: "Monthly payment cannot be greater than remaining balance.",
      });
    }
  });
