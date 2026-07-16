import type { ReactNode } from "react";
import type { ExpenseItem } from "@/types/expense";
import type {
  CreateExpensePayload,
  CreateIncomePayload,
  CreateInvestmentPayload,
  CreateLoanPayload,
} from "@/types/form-payload";
import type { IncomeItem } from "@/types/income";
import type { InvestmentItem } from "@/types/investment";
import type { LoanItem } from "@/types/loan";

export type FinanceContextValue = {
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
  investmentItems: InvestmentItem[];
  loanItems: LoanItem[];

  isIncomeLoading: boolean;
  incomeError: string | null;

  isExpenseLoading: boolean;
  expenseError: string | null;

  createIncome: (payload: CreateIncomePayload) => Promise<void>;
  createExpense: (payload: CreateExpensePayload) => Promise<void>;
  createInvestment: (payload: CreateInvestmentPayload) => void;
  createLoan: (payload: CreateLoanPayload) => void;

  updateIncome: (
    incomeId: string,
    payload: CreateIncomePayload,
  ) => Promise<void>;
  updateExpense: (
    expenseId: string,
    payload: CreateExpensePayload,
  ) => Promise<void>;
  updateInvestment: (
    investmentId: string,
    payload: CreateInvestmentPayload,
  ) => void;
  updateLoan: (loanId: string, payload: CreateLoanPayload) => void;

  deleteIncome: (incomeId: string) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  deleteInvestment: (investmentId: string) => void;
  deleteLoan: (loanId: string) => void;

  resetFinanceData: () => void;
};

export type FinanceProviderProps = {
  children: ReactNode;
};
