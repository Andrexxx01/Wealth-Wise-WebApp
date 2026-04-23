import type { ExpenseItem, ExpenseSummary } from "@/types/expense";

export const mockExpenseSummary: ExpenseSummary = {
  totalExpenses: 3460,
  essentialSpending: 2180,
  lifestyleSpending: 880,
  averageDailySpend: 115.33,
};

export const mockExpenseItems: ExpenseItem[] = [
  {
    id: "expense_1",
    userId: "user_1",
    title: "Apartment Rent",
    category: "HOUSING",
    type: "ESSENTIAL",
    amount: 1200,
    spentAt: "2026-04-02T00:00:00.000Z",
    notes: "Monthly rent payment",
    createdAt: "2026-04-02T00:00:00.000Z",
    updatedAt: "2026-04-02T00:00:00.000Z",
  },
  {
    id: "expense_2",
    userId: "user_1",
    title: "Supermarket",
    category: "FOOD",
    type: "ESSENTIAL",
    amount: 135,
    spentAt: "2026-04-06T00:00:00.000Z",
    notes: "Weekly groceries",
    createdAt: "2026-04-06T00:00:00.000Z",
    updatedAt: "2026-04-06T00:00:00.000Z",
  },
  {
    id: "expense_3",
    userId: "user_1",
    title: "Gas Refill",
    category: "TRANSPORT",
    type: "ESSENTIAL",
    amount: 48,
    spentAt: "2026-04-08T00:00:00.000Z",
    notes: "Fuel top-up",
    createdAt: "2026-04-08T00:00:00.000Z",
    updatedAt: "2026-04-08T00:00:00.000Z",
  },
  {
    id: "expense_4",
    userId: "user_1",
    title: "Netflix Subscription",
    category: "SUBSCRIPTION",
    type: "LIFESTYLE",
    amount: 15,
    spentAt: "2026-04-10T00:00:00.000Z",
    notes: "Monthly streaming fee",
    createdAt: "2026-04-10T00:00:00.000Z",
    updatedAt: "2026-04-10T00:00:00.000Z",
  },
];

export const mockExpenseCategoryBreakdown = [
  { name: "Housing", amount: 1200, percentage: 35 },
  { name: "Food & Dining", amount: 640, percentage: 18 },
  { name: "Transportation", amount: 420, percentage: 12 },
  { name: "Utilities", amount: 310, percentage: 9 },
  { name: "Entertainment", amount: 290, percentage: 8 },
  { name: "Shopping", amount: 220, percentage: 6 },
];

export const mockMonthlyExpenseBars = [
  { month: "Jan", value: 58 },
  { month: "Feb", value: 66 },
  { month: "Mar", value: 72 },
  { month: "Apr", value: 64 },
  { month: "May", value: 78 },
  { month: "Jun", value: 70 },
];
