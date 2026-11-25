import { EXPENSE_CATEGORY_VALUES } from "@/constants/finance-options";
import type { BudgetPayload } from "@/types/budget";

export function isBudgetMonth(value: unknown): value is string {
  return typeof value === "string" && /^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(value);
}

export function parseBudgetPayload(value: unknown): BudgetPayload {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Invalid budget details.");
  const body = value as Record<string, unknown>;
  if (Object.keys(body).some((key) => !["month", "category", "currency", "amount"].includes(key))) throw new Error("Invalid budget fields.");
  if (!isBudgetMonth(body.month)) throw new Error("Choose a valid month.");
  if (!EXPENSE_CATEGORY_VALUES.some((category) => category === body.category)) throw new Error("Choose a valid category.");
  if (body.currency !== "IDR" && body.currency !== "USD") throw new Error("Choose IDR or USD.");
  if (typeof body.amount !== "string" || !/^\d{1,10}(?:\.\d{1,2})?$/.test(body.amount) || Number(body.amount) <= 0) {
    throw new Error("Enter an amount above zero, up to 9,999,999,999.99, with at most two decimals.");
  }
  return body as BudgetPayload;
}
