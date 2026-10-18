import { formatCurrency } from "@/lib/formatters";
import {
  buildRecentFinanceMonthBuckets,
  findFinanceMonthBucketIndex,
} from "@/lib/finance-period";
import type {
  BuildCashFlowChartDataParams,
  BuildQuickSnapshotItemsParams,
  CashFlowChartItem,
  QuickSnapshotItem,
} from "@/types/finance-dashboard";

export function buildQuickSnapshotItems({
  totalInvested,
  netGain,
  recurringIncome,
  essentialSpending,
  currency,
}: BuildQuickSnapshotItemsParams): QuickSnapshotItem[] {
  return [
    {
      id: "total-invested",
      title: "Total Invested",
      subtitle: "Capital deployed",
      value: formatCurrency(totalInvested, currency),
      meta: `${netGain >= 0 ? "+" : ""}${formatCurrency(netGain, currency)}`,
      tone: netGain >= 0 ? "positive" : "danger",
    },
    {
      id: "recurring-income",
      title: "Recurring Income",
      subtitle: "Salary & fixed sources",
      value: formatCurrency(recurringIncome, currency),
      meta: "This month",
    },
    {
      id: "essential-spending",
      title: "Essential Spending",
      subtitle: "Needs & fixed costs",
      value: formatCurrency(essentialSpending, currency),
      meta: "This month",
    },
  ];
}

function normalizeChartValue(value: number, maxValue: number) {
  if (value <= 0 || maxValue <= 0) {
    return 0;
  }

  return Math.max(Math.round((value / maxValue) * 100), 6);
}

export function buildCashFlowChartData({
  incomeItems,
  expenseItems,
}: BuildCashFlowChartDataParams): CashFlowChartItem[] {
  const monthBuckets = buildRecentFinanceMonthBuckets();

  const monthlyIncome = Array.from({ length: monthBuckets.length }, () => 0);
  const monthlyExpenses = Array.from({ length: monthBuckets.length }, () => 0);

  incomeItems.forEach((item) => {
    const monthIndex = findFinanceMonthBucketIndex(
      monthBuckets,
      item.receivedAt,
    );

    if (monthIndex >= 0) {
      monthlyIncome[monthIndex] += item.amount;
    }
  });

  expenseItems.forEach((item) => {
    const monthIndex = findFinanceMonthBucketIndex(monthBuckets, item.spentAt);

    if (monthIndex >= 0) {
      monthlyExpenses[monthIndex] += item.amount;
    }
  });

  const maxValue = Math.max(...monthlyIncome, ...monthlyExpenses, 0);

  return monthBuckets.map((bucket, index) => ({
    label: bucket.label,
    primaryValue: normalizeChartValue(monthlyIncome[index], maxValue),
    secondaryValue: normalizeChartValue(monthlyExpenses[index], maxValue),
  }));
}
