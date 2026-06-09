import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { InvestmentItem } from "@/types/investment";
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

export type BuildInvestmentPerformanceChartDataParams = {
  investmentItems: InvestmentItem[];
};

export type BuildLoanPayoffChartDataParams = {
  loanItems: LoanItem[];
};
