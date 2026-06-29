import {
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_TYPE_OPTIONS,
  INCOME_CATEGORY_OPTIONS,
  INCOME_FREQUENCY_OPTIONS,
  INVESTMENT_CATEGORY_OPTIONS,
  LOAN_CATEGORY_OPTIONS,
} from "@/constants/finance-options";
import { ALL_FILTER_VALUE } from "@/constants/history-filters";
import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { InvestmentItem } from "@/types/investment";
import type { LoanItem } from "@/types/loan";

function isDateWithinRange(
  dateValue: string,
  dateFrom: string,
  dateTo: string,
) {
  const itemTime = new Date(dateValue).getTime();

  if (dateFrom) {
    const fromTime = new Date(dateFrom).getTime();

    if (itemTime < fromTime) {
      return false;
    }
  }

  if (dateTo) {
    const toTime = new Date(dateTo).getTime();

    if (itemTime > toTime) {
      return false;
    }
  }

  return true;
}

export const incomeInitialFilters = {
  category: ALL_FILTER_VALUE,
  frequency: ALL_FILTER_VALUE,
  dateFrom: "",
  dateTo: "",
};

export const incomeCategoryFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Categories" },
  ...INCOME_CATEGORY_OPTIONS,
] as const;

export const incomeFrequencyFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Frequencies" },
  ...INCOME_FREQUENCY_OPTIONS,
] as const;

export function doesIncomePassFilters(
  item: IncomeItem,
  filters: typeof incomeInitialFilters,
) {
  const matchesCategory =
    filters.category === ALL_FILTER_VALUE || item.category === filters.category;

  const matchesFrequency =
    filters.frequency === ALL_FILTER_VALUE ||
    item.frequency === filters.frequency;

  const matchesDate = isDateWithinRange(
    item.receivedAt,
    filters.dateFrom,
    filters.dateTo,
  );

  return matchesCategory && matchesFrequency && matchesDate;
}

export const expenseInitialFilters = {
  category: ALL_FILTER_VALUE,
  type: ALL_FILTER_VALUE,
  dateFrom: "",
  dateTo: "",
};

export const expenseCategoryFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Categories" },
  ...EXPENSE_CATEGORY_OPTIONS,
] as const;

export const expenseTypeFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Types" },
  ...EXPENSE_TYPE_OPTIONS,
] as const;

export function doesExpensePassFilters(
  item: ExpenseItem,
  filters: typeof expenseInitialFilters,
) {
  const matchesCategory =
    filters.category === ALL_FILTER_VALUE || item.category === filters.category;

  const matchesType =
    filters.type === ALL_FILTER_VALUE || item.type === filters.type;

  const matchesDate = isDateWithinRange(
    item.spentAt,
    filters.dateFrom,
    filters.dateTo,
  );

  return matchesCategory && matchesType && matchesDate;
}

export const investmentInitialFilters = {
  category: ALL_FILTER_VALUE,
  dateFrom: "",
  dateTo: "",
};

export const investmentCategoryFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Categories" },
  ...INVESTMENT_CATEGORY_OPTIONS,
] as const;

export function doesInvestmentPassFilters(
  item: InvestmentItem,
  filters: typeof investmentInitialFilters,
) {
  const matchesCategory =
    filters.category === ALL_FILTER_VALUE || item.category === filters.category;

  const matchesDate = isDateWithinRange(
    item.investedAt,
    filters.dateFrom,
    filters.dateTo,
  );

  return matchesCategory && matchesDate;
}

export const loanInitialFilters = {
  category: ALL_FILTER_VALUE,
  status: ALL_FILTER_VALUE,
  dateFrom: "",
  dateTo: "",
};

export const loanCategoryFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Categories" },
  ...LOAN_CATEGORY_OPTIONS,
] as const;

export const loanStatusFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAID_OFF", label: "Paid Off" },
  { value: "OVERDUE", label: "Overdue" },
] as const;

export function doesLoanPassFilters(
  item: LoanItem,
  filters: typeof loanInitialFilters,
) {
  const matchesCategory =
    filters.category === ALL_FILTER_VALUE || item.category === filters.category;

  const matchesStatus =
    filters.status === ALL_FILTER_VALUE || item.status === filters.status;

  const matchesDate = item.dueDate
    ? isDateWithinRange(item.dueDate, filters.dateFrom, filters.dateTo)
    : !filters.dateFrom && !filters.dateTo;

  return matchesCategory && matchesStatus && matchesDate;
}
