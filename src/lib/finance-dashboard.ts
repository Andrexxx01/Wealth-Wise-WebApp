import { formatCurrency } from "@/lib/formatters";
import type {
  BuildCashFlowChartDataParams,
  BuildQuickSnapshotItemsParams,
  CashFlowChartItem,
  QuickSnapshotItem,
} from "@/types/finance-dashboard";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export function buildQuickSnapshotItems({
  totalInvested,
  netGain,
  recurringIncome,
  essentialSpending,
}: BuildQuickSnapshotItemsParams): QuickSnapshotItem[] {
  return [
    {
      id: "total-invested",
      title: "Total Invested",
      subtitle: "Capital deployed",
      value: formatCurrency(totalInvested),
      meta: `${netGain >= 0 ? "+" : ""}${formatCurrency(netGain)}`,
      tone: netGain >= 0 ? "positive" : "danger",
    },
    {
      id: "recurring-income",
      title: "Recurring Income",
      subtitle: "Salary & fixed sources",
      value: formatCurrency(recurringIncome),
      meta: "Monthly",
    },
    {
      id: "essential-spending",
      title: "Essential Spending",
      subtitle: "Needs & fixed costs",
      value: formatCurrency(essentialSpending),
      meta: "Needs",
    },
  ];
}

function getMonthIndex(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return -1;
  }

  return date.getMonth();
}

function normalizeChartValue(value: number, maxValue: number) {
  if (maxValue <= 0) return 0;

  return Math.max(Math.round((value / maxValue) * 100), 6);
}

export function buildCashFlowChartData({
  incomeItems,
  expenseItems,
}: BuildCashFlowChartDataParams): CashFlowChartItem[] {
  const monthlyIncome = Array.from({ length: 6 }, () => 0);
  const monthlyExpenses = Array.from({ length: 6 }, () => 0);

  incomeItems.forEach((item) => {
    const monthIndex = getMonthIndex(item.receivedAt);

    if (monthIndex >= 0 && monthIndex < 6) {
      monthlyIncome[monthIndex] += item.amount;
    }
  });

  expenseItems.forEach((item) => {
    const monthIndex = getMonthIndex(item.spentAt);

    if (monthIndex >= 0 && monthIndex < 6) {
      monthlyExpenses[monthIndex] += item.amount;
    }
  });

  const maxValue = Math.max(...monthlyIncome, ...monthlyExpenses, 0);

  return MONTH_LABELS.map((month, index) => ({
    label: month,
    primaryValue: normalizeChartValue(monthlyIncome[index], maxValue),
    secondaryValue: normalizeChartValue(monthlyExpenses[index], maxValue),
  }));
}
