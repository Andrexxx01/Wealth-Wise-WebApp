import type {
  BuildInvestmentPerformanceChartDataParams,
  BuildLoanPayoffChartDataParams,
  BuildMonthlyExpenseChartDataParams,
  BuildMonthlyIncomeChartDataParams,
  SingleBarChartItem,
} from "@/types/finance-chart";

const CHART_MONTH_COUNT = 6;

type MonthBucket = {
  key: string;
  label: string;
};

function getMonthKey(dateValue: string | null) {
  if (!dateValue) return null;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function buildRecentMonthBuckets(referenceDate = new Date()): MonthBucket[] {
  return Array.from({ length: CHART_MONTH_COUNT }, (_, index) => {
    const monthsAgo = CHART_MONTH_COUNT - 1 - index;

    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - monthsAgo,
      1,
    );

    const year = date.getFullYear();
    const monthIndex = date.getMonth();

    const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

    const monthLabel = date.toLocaleString("en-US", {
      month: "short",
    });

    const shortYear = String(year).slice(-2);

    return {
      key,
      label: `${monthLabel} '${shortYear}`,
    };
  });
}

function normalizeChartValue(value: number, maxValue: number) {
  if (value <= 0 || maxValue <= 0) {
    return 0;
  }

  return Math.max(Math.round((value / maxValue) * 100), 8);
}

function buildNormalizedMonthlyChartData(
  monthlyValues: number[],
  monthBuckets: MonthBucket[],
): SingleBarChartItem[] {
  const maxValue = Math.max(...monthlyValues, 0);

  return monthBuckets.map((bucket, index) => ({
    label: bucket.label,
    value: normalizeChartValue(monthlyValues[index], maxValue),
  }));
}

function createMonthlyValues() {
  return Array.from({ length: CHART_MONTH_COUNT }, () => 0);
}

function findMonthBucketIndex(
  monthBuckets: MonthBucket[],
  dateValue: string | null,
) {
  const monthKey = getMonthKey(dateValue);

  if (!monthKey) {
    return -1;
  }

  return monthBuckets.findIndex((bucket) => bucket.key === monthKey);
}

export function buildMonthlyIncomeChartData({
  incomeItems,
}: BuildMonthlyIncomeChartDataParams): SingleBarChartItem[] {
  const monthBuckets = buildRecentMonthBuckets();
  const monthlyIncome = createMonthlyValues();

  incomeItems.forEach((item) => {
    const monthIndex = findMonthBucketIndex(monthBuckets, item.receivedAt);

    if (monthIndex >= 0) {
      monthlyIncome[monthIndex] += item.amount;
    }
  });

  return buildNormalizedMonthlyChartData(monthlyIncome, monthBuckets);
}

export function buildMonthlyExpenseChartData({
  expenseItems,
}: BuildMonthlyExpenseChartDataParams): SingleBarChartItem[] {
  const monthBuckets = buildRecentMonthBuckets();
  const monthlyExpenses = createMonthlyValues();

  expenseItems.forEach((item) => {
    const monthIndex = findMonthBucketIndex(monthBuckets, item.spentAt);

    if (monthIndex >= 0) {
      monthlyExpenses[monthIndex] += item.amount;
    }
  });

  return buildNormalizedMonthlyChartData(monthlyExpenses, monthBuckets);
}

export function buildInvestmentContributionChartData({
  investmentItems,
}: BuildInvestmentPerformanceChartDataParams): SingleBarChartItem[] {
  const monthBuckets = buildRecentMonthBuckets();
  const monthlyInvestment = createMonthlyValues();

  investmentItems.forEach((item) => {
    const monthIndex = findMonthBucketIndex(monthBuckets, item.investedAt);

    if (monthIndex >= 0) {
      monthlyInvestment[monthIndex] += item.investedAmount;
    }
  });

  return buildNormalizedMonthlyChartData(monthlyInvestment, monthBuckets);
}

export function buildLoanPayoffChartData({
  loanItems,
}: BuildLoanPayoffChartDataParams): SingleBarChartItem[] {
  const monthBuckets = buildRecentMonthBuckets();
  const monthlyPaidOffAmount = createMonthlyValues();

  loanItems.forEach((item) => {
    const monthIndex = findMonthBucketIndex(monthBuckets, item.createdAt);

    const paidOffAmount = Math.max(
      item.principalAmount - item.remainingBalance,
      0,
    );

    if (monthIndex >= 0) {
      monthlyPaidOffAmount[monthIndex] += paidOffAmount;
    }
  });

  return buildNormalizedMonthlyChartData(monthlyPaidOffAmount, monthBuckets);
}
