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
