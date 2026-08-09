import type { UserCurrency } from "@/types/user-subscription";

export type ExpenseCategory =
  | "HOUSING"
  | "FOOD"
  | "TRANSPORT"
  | "UTILITIES"
  | "HEALTH"
  | "EDUCATION"
  | "SHOPPING"
  | "ENTERTAINMENT"
  | "SUBSCRIPTION"
  | "TRAVEL"
  | "OTHER";

export type ExpenseType = "ESSENTIAL" | "LIFESTYLE";

export interface ExpenseItem {
  id: string;
  userId: string;
  title: string;
  category: ExpenseCategory;
  type: ExpenseType;
  amount: number;
  currency: UserCurrency;
  spentAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  essentialSpending: number;
  lifestyleSpending: number;
  averageDailySpend: number;
}

export type CreateExpenseFormValues = {
  title: string;
  category: ExpenseCategory;
  type: ExpenseType;
  amount: string;
  currency: UserCurrency;
  spentAt: string;
  notes?: string;
};
