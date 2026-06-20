import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateExpenseFormValues } from "@/types/expense";
import type { CreateIncomeFormValues } from "@/types/income";
import type { CreateInvestmentFormValues } from "@/types/investment";
import type { CreateLoanFormValues } from "@/types/loan";

export type IncomeFormFieldsProps = {
  register: UseFormRegister<CreateIncomeFormValues>;
  errors: FieldErrors<CreateIncomeFormValues>;
};

export type ExpenseFormFieldsProps = {
  register: UseFormRegister<CreateExpenseFormValues>;
  errors: FieldErrors<CreateExpenseFormValues>;
};

export type InvestmentFormFieldsProps = {
  register: UseFormRegister<CreateInvestmentFormValues>;
  errors: FieldErrors<CreateInvestmentFormValues>;
};

export type LoanFormFieldsProps = {
  register: UseFormRegister<CreateLoanFormValues>;
  errors: FieldErrors<CreateLoanFormValues>;
};
