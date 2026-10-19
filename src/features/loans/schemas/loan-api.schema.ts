import { z } from "zod";

export const loanApiSchema = z
  .object({
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
      .min(0, "Monthly payment cannot be negative"),
    currency: z.enum(["USD", "IDR"]),
    interestRate: z.coerce.number().min(0).optional().nullable(),
    dueDate: z.string().optional().nullable(),
    status: z.enum(["ACTIVE", "PAID_OFF", "OVERDUE"]).default("ACTIVE"),
  })
  .superRefine((values, ctx) => {
    if (values.remainingBalance > values.principalAmount) {
      ctx.addIssue({
        code: "custom",
        path: ["remainingBalance"],
        message: "Remaining balance cannot be greater than principal amount.",
      });
    }

    if (values.status === "PAID_OFF") {
      if (values.remainingBalance !== 0) {
        ctx.addIssue({
          code: "custom",
          path: ["remainingBalance"],
          message: "Paid-off loans must have a remaining balance of 0.",
        });
      }

      return;
    }

    if (values.remainingBalance <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["remainingBalance"],
        message: "Active or overdue loans must have a remaining balance greater than 0.",
      });
    }

    if (values.monthlyPayment <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["monthlyPayment"],
        message: "Monthly payment must be greater than 0 for active or overdue loans.",
      });
    }

    if (values.monthlyPayment > values.remainingBalance) {
      ctx.addIssue({
        code: "custom",
        path: ["monthlyPayment"],
        message: "Monthly payment cannot be greater than remaining balance.",
      });
    }
  });
