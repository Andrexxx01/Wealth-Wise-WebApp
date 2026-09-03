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
import type {
  CreateInvestmentAssetV2Payload,
  CreateInvestmentTransactionV2Payload,
  InvestmentRecentTransactionV2Item,
  InvestmentValuationsResponse,
  InvestmentContributionV2Item,
} from "@/types/investment-v2";
import type { LoanItem } from "@/types/loan";

export type FinanceContextValue = {
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
  investmentItems: InvestmentItem[];
  loanItems: LoanItem[];

  investmentPortfolioV2: InvestmentValuationsResponse | null;

  investmentTransactionsV2: InvestmentRecentTransactionV2Item[];

  investmentContributionsV2: InvestmentContributionV2Item[];

  isInvestmentContributionsV2Loading: boolean;

  investmentContributionsV2Error: string | null;

  refreshInvestmentContributionsV2: () => Promise<void>;

  isInvestmentTransactionsV2Loading: boolean;

  investmentTransactionsV2Error: string | null;

  refreshInvestmentTransactionsV2: () => Promise<void>;

  isIncomeLoading: boolean;
  incomeError: string | null;

  isExpenseLoading: boolean;
  expenseError: string | null;

  isInvestmentLoading: boolean;
  investmentError: string | null;

  isInvestmentPortfolioV2Loading: boolean;
  investmentPortfolioV2Error: string | null;

  isLoanLoading: boolean;
  loanError: string | null;

  createIncome: (payload: CreateIncomePayload) => Promise<void>;
  createExpense: (payload: CreateExpensePayload) => Promise<void>;
  createInvestment: (payload: CreateInvestmentPayload) => Promise<void>;
  createLoan: (payload: CreateLoanPayload) => Promise<void>;

  createInvestmentAsset: (
    payload: CreateInvestmentAssetV2Payload,
  ) => Promise<void>;

  addInvestmentTransaction: (
    assetId: string,
    payload: CreateInvestmentTransactionV2Payload,
  ) => Promise<void>;

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
  ) => Promise<void>;

  updateLoan: (loanId: string, payload: CreateLoanPayload) => Promise<void>;

  deleteIncome: (incomeId: string) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  deleteInvestment: (investmentId: string) => Promise<void>;
  deleteLoan: (loanId: string) => Promise<void>;

  refreshInvestmentPortfolioV2: () => Promise<void>;

  resetFinanceData: () => void;
};

export type FinanceProviderProps = {
  children: ReactNode;
};
