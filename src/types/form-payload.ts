import type { IncomeCategory, IncomeFrequency } from "@/types/income";
import type { ExpenseCategory, ExpenseType } from "@/types/expense";
import type { InvestmentCategory } from "@/types/investment";
import type { LoanCategory } from "@/types/loan";
import type { UserCurrency } from "@/types/user-subscription";

export type CreateIncomePayload = {
  title: string;
  category: IncomeCategory;
  amount: number;
  currency: UserCurrency;
  receivedAt: string;
  frequency: IncomeFrequency;
  notes: string | null;
};

export type CreateExpensePayload = {
  title: string;
  category: ExpenseCategory;
  type: ExpenseType;
  amount: number;
  currency: UserCurrency;
  spentAt: string;
  notes: string | null;
};

export type CreateInvestmentPayload = {
  assetName: string;
  category: InvestmentCategory;
  investedAmount: number;
  currentValue: number;
  currency: UserCurrency;
  investedAt: string;
  notes: string | null;
};

export type CreateLoanPayload = {
  title: string;
  lenderName: string;
  category: LoanCategory;
  principalAmount: number;
  remainingBalance: number;
  monthlyPayment: number;
  currency: UserCurrency;
  interestRate: number | null;
  dueDate: string | null;
};
