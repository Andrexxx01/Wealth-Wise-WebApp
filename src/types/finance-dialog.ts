import type {
  CreateExpensePayload,
  CreateIncomePayload,
  CreateLoanPayload,
} from "@/types/form-payload";
import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { LoanItem } from "@/types/loan";

export type AddIncomeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateIncome: (payload: CreateIncomePayload) => Promise<void>;
};

export type EditIncomeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income: IncomeItem | null;
  onUpdateIncome: (
    incomeId: string,
    payload: CreateIncomePayload,
  ) => Promise<void>;
};

export type AddExpenseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateExpense: (payload: CreateExpensePayload) => Promise<void>;
};

export type EditExpenseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseItem | null;
  onUpdateExpense: (
    expenseId: string,
    payload: CreateExpensePayload,
  ) => Promise<void>;
};

export type AddLoanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateLoan: (payload: CreateLoanPayload) => Promise<void>;
};

export type EditLoanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: LoanItem | null;
  onUpdateLoan: (loanId: string, payload: CreateLoanPayload) => Promise<void>;
};
