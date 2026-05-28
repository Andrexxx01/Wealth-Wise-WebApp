import type {
  CreateExpensePayload,
  CreateIncomePayload,
  CreateInvestmentPayload,
  CreateLoanPayload,
} from "@/types/form-payload";

export type AddIncomeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateIncome: (payload: CreateIncomePayload) => void;
};

export type AddExpenseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateExpense: (payload: CreateExpensePayload) => void;
};

export type AddInvestmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInvestment: (payload: CreateInvestmentPayload) => void;
};

export type AddLoanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateLoan: (payload: CreateLoanPayload) => void;
};
