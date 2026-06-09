import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { DashboardListItemTone } from "@/types/ui";

export type QuickSnapshotItem = {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  meta: string;
  tone?: DashboardListItemTone;
};

export type BuildQuickSnapshotItemsParams = {
  totalInvested: number;
  netGain: number;
  recurringIncome: number;
  essentialSpending: number;
};

export type CashFlowChartItem = {
  label: string;
  primaryValue: number;
  secondaryValue: number;
};

export type BuildCashFlowChartDataParams = {
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
};
