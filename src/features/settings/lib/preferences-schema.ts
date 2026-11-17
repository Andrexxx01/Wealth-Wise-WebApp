import { z } from "zod";

export const preferencesSchema = z.object({
  currency: z.enum(["USD", "IDR"]),
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]),
}).strict();
