import type { UserCurrency } from "@/types/user-subscription";

export type LoanCategory =
  | "PERSONAL"
  | "CONSUMER"
  | "VEHICLE"
  | "MORTGAGE"
  | "STUDENT"
  | "BUSINESS"
  | "OTHER";

export type LoanStatus = "ACTIVE" | "PAID_OFF" | "OVERDUE";

export interface LoanItem {
  id: string;
  userId: string;
  lenderName: string;
  title: string;
  category: LoanCategory;
  principalAmount: number;
  remainingBalance: number;
  monthlyPayment: number;
  currency: UserCurrency;
  interestRate: number | null;
  dueDate: string | null;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoanSummary {
  totalLoanBalance: number;
  monthlyPaymentTotal: number;
  totalPaidOff: number;
  debtToIncomeRatio: number;
}

export type CreateLoanFormValues = {
  title: string;
  lenderName: string;
  category: LoanCategory;
  principalAmount: string;
  remainingBalance: string;
  monthlyPayment: string;
  currency: UserCurrency;
  interestRate?: string;
  dueDate?: string;
};
