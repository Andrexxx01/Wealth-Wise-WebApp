import type {
  BuildInvestmentPerformanceChartDataParams,
  BuildLoanPayoffChartDataParams,
  BuildMonthlyExpenseChartDataParams,
  BuildMonthlyIncomeChartDataParams,
  SingleBarChartItem,
} from "@/types/finance-chart";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function getMonthIndex(dateValue: string | null) {
  if (!dateValue) return -1;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return -1;
  }

  return date.getMonth();
}

function normalizeChartValue(value: number, maxValue: number) {
  if (value <= 0 || maxValue <= 0) return 0;

  return Math.max(Math.round((value / maxValue) * 100), 8);
}

function buildNormalizedMonthlyChartData(
  monthlyValues: number[],
): SingleBarChartItem[] {
  const maxValue = Math.max(...monthlyValues, 0);

  return MONTH_LABELS.map((month, index) => ({
    label: month,
    value: normalizeChartValue(monthlyValues[index], maxValue),
  }));
}

export function buildMonthlyIncomeChartData({
  incomeItems,
}: BuildMonthlyIncomeChartDataParams): SingleBarChartItem[] {
  const monthlyIncome = Array.from({ length: 6 }, () => 0);

  incomeItems.forEach((item) => {
    const monthIndex = getMonthIndex(item.receivedAt);

    if (monthIndex >= 0 && monthIndex < 6) {
      monthlyIncome[monthIndex] += item.amount;
    }
  });

  return buildNormalizedMonthlyChartData(monthlyIncome);
}

export function buildMonthlyExpenseChartData({
  expenseItems,
}: BuildMonthlyExpenseChartDataParams): SingleBarChartItem[] {
  const monthlyExpenses = Array.from({ length: 6 }, () => 0);

  expenseItems.forEach((item) => {
    const monthIndex = getMonthIndex(item.spentAt);

    if (monthIndex >= 0 && monthIndex < 6) {
      monthlyExpenses[monthIndex] += item.amount;
    }
  });

  return buildNormalizedMonthlyChartData(monthlyExpenses);
}

export function buildInvestmentPerformanceChartData({
  investmentItems,
}: BuildInvestmentPerformanceChartDataParams): SingleBarChartItem[] {
  const monthlyPortfolioValue = Array.from({ length: 6 }, () => 0);

  investmentItems.forEach((item) => {
    const monthIndex = getMonthIndex(item.investedAt);

    if (monthIndex >= 0 && monthIndex < 6) {
      monthlyPortfolioValue[monthIndex] += item.currentValue;
    }
  });

  return buildNormalizedMonthlyChartData(monthlyPortfolioValue);
}

export function buildLoanPayoffChartData({
  loanItems,
}: BuildLoanPayoffChartDataParams): SingleBarChartItem[] {
  const monthlyPaidOffAmount = Array.from({ length: 6 }, () => 0);

  loanItems.forEach((item) => {
    const monthIndex = getMonthIndex(item.createdAt);
    const paidOffAmount = Math.max(
      item.principalAmount - item.remainingBalance,
      0,
    );

    if (monthIndex >= 0 && monthIndex < 6) {
      monthlyPaidOffAmount[monthIndex] += paidOffAmount;
    }
  });

  return buildNormalizedMonthlyChartData(monthlyPaidOffAmount);
}
