import type { ExpenseCategory } from "@/types/expense";
import type { UserCurrency } from "@/types/user-subscription";

export type BudgetItem = {
  id: string;
  month: string;
  category: ExpenseCategory;
  currency: UserCurrency;
  amount: string;
};

export type BudgetPayload = Omit<BudgetItem, "id">;
export type BudgetUsage = {
  spent: bigint;
  remaining: bigint;
  percent: number;
  status: "Within budget" | "Near limit" | "At limit" | "Over budget";
};
