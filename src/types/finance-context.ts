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

  createIncome: (payload: CreateIncomePayload) => void;
  createExpense: (payload: CreateExpensePayload) => void;
  createInvestment: (payload: CreateInvestmentPayload) => void;
  createLoan: (payload: CreateLoanPayload) => void;

  deleteIncome: (incomeId: string) => void;
  deleteExpense: (expenseId: string) => void;
  deleteInvestment: (investmentId: string) => void;
  deleteLoan: (loanId: string) => void;
  resetFinanceData: () => void;
  updateIncome: (incomeId: string, payload: CreateIncomePayload) => void;
  updateExpense: (expenseId: string, payload: CreateExpensePayload) => void;
  updateInvestment: (
    investmentId: string,
    payload: CreateInvestmentPayload,
  ) => void;
  updateLoan: (loanId: string, payload: CreateLoanPayload) => void;
};

export type FinanceProviderProps = {
  children: ReactNode;
};
