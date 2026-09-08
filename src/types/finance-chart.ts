import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { LoanItem } from "@/types/loan";

export type SingleBarChartItem = {
  label: string;
  value: number;
};

export type BuildMonthlyIncomeChartDataParams = {
  incomeItems: IncomeItem[];
};

export type BuildMonthlyExpenseChartDataParams = {
  expenseItems: ExpenseItem[];
};

export type BuildLoanPayoffChartDataParams = {
  loanItems: LoanItem[];
};
