export type IncomeCategory =
  | "SALARY"
  | "FREELANCE"
  | "BUSINESS"
  | "INVESTMENT_RETURN"
  | "BONUS"
  | "GIFT"
  | "OTHER";

export type IncomeFrequency =
  | "ONE_TIME"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "YEARLY";

export interface IncomeItem {
  id: string;
  userId: string;
  title: string;
  category: IncomeCategory;
  amount: number;
  receivedAt: string;
  frequency: IncomeFrequency;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeSummary {
  totalIncome: number;
  recurringIncome: number;
  extraIncome: number;
  projectedAnnualIncome: number;
}
