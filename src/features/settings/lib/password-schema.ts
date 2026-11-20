import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password.").max(1024),
  newPassword: z.string().min(8, "Use at least 8 characters.")
    .refine((value) => new TextEncoder().encode(value).length <= 72,
      "Use at most 72 bytes (fewer characters for emoji or accented text)."),
  confirmPassword: z.string().min(1, "Confirm your new password."),
}).strict().superRefine((values, context) => {
  if (values.newPassword !== values.confirmPassword) {
    context.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords do not match." });
  }
  if (values.currentPassword === values.newPassword) {
    context.addIssue({ code: "custom", path: ["newPassword"], message: "Choose a different password." });
  }
});
