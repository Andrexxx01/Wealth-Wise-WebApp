import { z } from "zod";

export const profileSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Enter your name.")
    .max(80, "Use no more than 80 characters.")
    .regex(/^[^\u0000-\u001F\u007F]+$/u, "Use a single line without control characters."),
}).strict();
