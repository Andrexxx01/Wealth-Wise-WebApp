import type { BudgetItem, BudgetUsage } from "@/types/budget";
import type { ExpenseItem } from "@/types/expense";

export function budgetMinor(value: string): bigint {
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(value)) throw new Error("Invalid amount.");
  const negative = value.startsWith("-");
  const [whole, fraction = ""] = value.replace(/^-/, "").split(".");
  const result = BigInt(whole) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
  return negative ? -result : result;
}

export function calculateBudgetUsage(budget: BudgetItem, expenses: ExpenseItem[]): BudgetUsage {
  const limit = budgetMinor(budget.amount);
  if (limit <= BigInt(0)) throw new Error("Budget must be above zero.");
  let spent = BigInt(0);
  for (const expense of expenses) {
    // Expense API exposes spentAt as YYYY-MM-DD. Match that date directly,
    // avoiding a device-timezone shift at month boundaries.
    if (expense.spentAt.slice(0, 7) !== budget.month || expense.category !== budget.category || expense.currency !== budget.currency) continue;
    if (!Number.isFinite(expense.amount)) throw new Error("Expense amount is unavailable.");
    spent += budgetMinor(expense.amount.toFixed(2));
  }
  const percent = Number((spent * BigInt(10000)) / limit) / 100;
  const status = spent > limit ? "Over budget" : spent === limit ? "At limit"
    : spent * BigInt(100) >= limit * BigInt(80) ? "Near limit" : "Within budget";
  return { spent, remaining: limit - spent, percent, status };
}
