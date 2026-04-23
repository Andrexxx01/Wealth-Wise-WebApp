import type { IncomeItem, IncomeSummary } from "@/types/income";

export const mockIncomeSummary: IncomeSummary = {
  totalIncome: 8200,
  recurringIncome: 6500,
  extraIncome: 1700,
  projectedAnnualIncome: 98400,
};

export const mockIncomeItems: IncomeItem[] = [
  {
    id: "income_1",
    userId: "user_1",
    title: "Primary Salary",
    category: "SALARY",
    amount: 5500,
    receivedAt: "2026-04-01T00:00:00.000Z",
    frequency: "MONTHLY",
    notes: "Main full-time salary",
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
  },
  {
    id: "income_2",
    userId: "user_1",
    title: "Freelance Website Project",
    category: "FREELANCE",
    amount: 900,
    receivedAt: "2026-04-05T00:00:00.000Z",
    frequency: "ONE_TIME",
    notes: "Client landing page project",
    createdAt: "2026-04-05T00:00:00.000Z",
    updatedAt: "2026-04-05T00:00:00.000Z",
  },
  {
    id: "income_3",
    userId: "user_1",
    title: "Consulting Session",
    category: "BUSINESS",
    amount: 500,
    receivedAt: "2026-04-09T00:00:00.000Z",
    frequency: "ONE_TIME",
    notes: "UI/UX consulting",
    createdAt: "2026-04-09T00:00:00.000Z",
    updatedAt: "2026-04-09T00:00:00.000Z",
  },
  {
    id: "income_4",
    userId: "user_1",
    title: "Affiliate Commission",
    category: "OTHER",
    amount: 300,
    receivedAt: "2026-04-12T00:00:00.000Z",
    frequency: "ONE_TIME",
    notes: "Monthly affiliate payout",
    createdAt: "2026-04-12T00:00:00.000Z",
    updatedAt: "2026-04-12T00:00:00.000Z",
  },
];

export const mockMonthlyIncomeBars = [
  { month: "Jan", value: 68 },
  { month: "Feb", value: 74 },
  { month: "Mar", value: 62 },
  { month: "Apr", value: 86 },
  { month: "May", value: 78 },
  { month: "Jun", value: 92 },
];
