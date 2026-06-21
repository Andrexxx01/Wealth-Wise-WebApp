import {
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_TYPE_OPTIONS,
  INCOME_CATEGORY_OPTIONS,
  INCOME_FREQUENCY_OPTIONS,
  INVESTMENT_CATEGORY_OPTIONS,
  LOAN_CATEGORY_OPTIONS,
} from "@/constants/finance-options";
import type { ExpenseCategory, ExpenseType } from "@/types/expense";
import type { IncomeCategory, IncomeFrequency } from "@/types/income";
import type { InvestmentCategory } from "@/types/investment";
import type { LoanCategory, LoanItem } from "@/types/loan";

type LabelOption = {
  value: string;
  label: string;
};

function getOptionLabel(options: readonly LabelOption[], value: string) {
  const option = options.find((item) => item.value === value);

  return option?.label ?? value;
}

export function formatIncomeCategory(category: IncomeCategory) {
  return getOptionLabel(INCOME_CATEGORY_OPTIONS, category);
}

export function formatIncomeFrequency(frequency: IncomeFrequency) {
  if (frequency === "ONE_TIME") {
    return "Irregular";
  }

  return getOptionLabel(INCOME_FREQUENCY_OPTIONS, frequency);
}

export function formatExpenseCategory(category: ExpenseCategory) {
  return getOptionLabel(EXPENSE_CATEGORY_OPTIONS, category);
}

export function formatExpenseType(type: ExpenseType) {
  return getOptionLabel(EXPENSE_TYPE_OPTIONS, type);
}

export function formatInvestmentCategory(category: InvestmentCategory) {
  return getOptionLabel(INVESTMENT_CATEGORY_OPTIONS, category);
}

export function formatLoanCategory(category: LoanCategory) {
  return getOptionLabel(LOAN_CATEGORY_OPTIONS, category);
}

export function formatLoanStatus(status: LoanItem["status"]) {
  const statusLabels: Record<LoanItem["status"], string> = {
    ACTIVE: "Active",
    PAID_OFF: "Paid Off",
    OVERDUE: "Overdue",
  };

  return statusLabels[status];
}
