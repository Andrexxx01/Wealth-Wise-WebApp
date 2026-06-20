import type { CreateExpenseFormValues } from "@/types/expense";
import type { CreateIncomeFormValues } from "@/types/income";
import type { CreateInvestmentFormValues } from "@/types/investment";
import type { CreateLoanFormValues } from "@/types/loan";

export const DEFAULT_INCOME_FORM_VALUES: CreateIncomeFormValues = {
  title: "",
  category: "SALARY",
  amount: "",
  receivedAt: "",
  frequency: "MONTHLY",
  notes: "",
};

export const DEFAULT_EXPENSE_FORM_VALUES: CreateExpenseFormValues = {
  title: "",
  category: "FOOD",
  type: "ESSENTIAL",
  amount: "",
  spentAt: "",
  notes: "",
};

export const DEFAULT_INVESTMENT_FORM_VALUES: CreateInvestmentFormValues = {
  assetName: "",
  category: "STOCK",
  investedAmount: "",
  currentValue: "",
  investedAt: "",
  notes: "",
};

export const DEFAULT_LOAN_FORM_VALUES: CreateLoanFormValues = {
  title: "",
  lenderName: "",
  category: "PERSONAL",
  principalAmount: "",
  remainingBalance: "",
  monthlyPayment: "",
  interestRate: "",
  dueDate: "",
};
