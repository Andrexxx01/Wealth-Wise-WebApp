import type {
  CreateExpensePayload,
  CreateIncomePayload,
  CreateInvestmentPayload,
  CreateLoanPayload,
} from "@/types/form-payload";
import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { InvestmentItem } from "@/types/investment";
import type { LoanItem } from "@/types/loan";

export type AddIncomeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateIncome: (payload: CreateIncomePayload) => void;
};

export type EditIncomeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income: IncomeItem | null;
  onUpdateIncome: (incomeId: string, payload: CreateIncomePayload) => void;
};

export type AddExpenseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateExpense: (payload: CreateExpensePayload) => void;
};

export type EditExpenseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseItem | null;
  onUpdateExpense: (expenseId: string, payload: CreateExpensePayload) => void;
};

export type AddInvestmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInvestment: (payload: CreateInvestmentPayload) => void;
};

export type EditInvestmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investment: InvestmentItem | null;
  onUpdateInvestment: (
    investmentId: string,
    payload: CreateInvestmentPayload,
  ) => void;
};

export type AddLoanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateLoan: (payload: CreateLoanPayload) => void;
};

export type EditLoanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: LoanItem | null;
  onUpdateLoan: (loanId: string, payload: CreateLoanPayload) => void;
};
