import type {
  BuildLoanPayoffChartDataParams,
  BuildMonthlyExpenseChartDataParams,
  BuildMonthlyIncomeChartDataParams,
  SingleBarChartItem,
} from "@/types/finance-chart";
import { convertCurrencyWithUsdRates } from "@/lib/currency-conversion";

import type { InvestmentContributionV2Item } from "@/types/investment-v2";

import type { UserCurrency } from "@/types/user-subscription";
import {
  buildRecentFinanceMonthBuckets,
  findFinanceMonthBucketIndex,
  type FinanceMonthBucket,
} from "@/lib/finance-period";

type BuildInvestmentV2ContributionChartDataParams = {
  contributions: InvestmentContributionV2Item[];

  displayCurrency: UserCurrency;

  fxRates: Record<string, number>;
};

function normalizeChartValue(value: number, maxValue: number) {
  if (value <= 0 || maxValue <= 0) {
    return 0;
  }

  return Math.max(Math.round((value / maxValue) * 100), 8);
}

function buildNormalizedMonthlyChartData(
  monthlyValues: number[],
  monthBuckets: FinanceMonthBucket[],
): SingleBarChartItem[] {
  const maxValue = Math.max(...monthlyValues, 0);

  return monthBuckets.map((bucket, index) => ({
    label: bucket.label,
    value: normalizeChartValue(monthlyValues[index], maxValue),
  }));
}

function createMonthlyValues() {
  return Array.from({ length: 6 }, () => 0);
}

export function buildInvestmentV2ContributionChartData({
  contributions,
  displayCurrency,
  fxRates,
}: BuildInvestmentV2ContributionChartDataParams): SingleBarChartItem[] {
  const monthBuckets = buildRecentFinanceMonthBuckets();

  const monthlyInvestment = createMonthlyValues();

  contributions.forEach((transaction) => {
    const monthIndex = findFinanceMonthBucketIndex(
      monthBuckets,
      transaction.transactedAt,
    );

    if (monthIndex < 0) {
      return;
    }

    /*
     * Contribution = uang yang benar-benar
     * digunakan untuk menambah investment.
     *
     * BUY:
     * gross + fee
     *
     * OPEN:
     * principal + fee
     */
    const contributionAmount = transaction.grossAmount + transaction.feeAmount;

    const contributionInDisplayCurrency = convertCurrencyWithUsdRates({
      amount: contributionAmount,
      fromCurrency: transaction.currencyCode,
      toCurrency: displayCurrency,
      usdRates: fxRates,
    });

    /*
     * Currency tanpa FX rate tidak boleh diam-diam
     * dijumlahkan bersama display currency.
     */
    if (contributionInDisplayCurrency === null) {
      return;
    }

    monthlyInvestment[monthIndex] += contributionInDisplayCurrency;
  });

  return buildNormalizedMonthlyChartData(monthlyInvestment, monthBuckets);
}

export function buildMonthlyIncomeChartData({
  incomeItems,
}: BuildMonthlyIncomeChartDataParams): SingleBarChartItem[] {
  const monthBuckets = buildRecentFinanceMonthBuckets();
  const monthlyIncome = createMonthlyValues();

  incomeItems.forEach((item) => {
    const monthIndex = findFinanceMonthBucketIndex(monthBuckets, item.receivedAt);

    if (monthIndex >= 0) {
      monthlyIncome[monthIndex] += item.amount;
    }
  });

  return buildNormalizedMonthlyChartData(monthlyIncome, monthBuckets);
}

export function buildMonthlyExpenseChartData({
  expenseItems,
}: BuildMonthlyExpenseChartDataParams): SingleBarChartItem[] {
  const monthBuckets = buildRecentFinanceMonthBuckets();
  const monthlyExpenses = createMonthlyValues();

  expenseItems.forEach((item) => {
    const monthIndex = findFinanceMonthBucketIndex(monthBuckets, item.spentAt);

    if (monthIndex >= 0) {
      monthlyExpenses[monthIndex] += item.amount;
    }
  });

  return buildNormalizedMonthlyChartData(monthlyExpenses, monthBuckets);
}

export function buildLoanPayoffChartData({
  loanItems,
}: BuildLoanPayoffChartDataParams): SingleBarChartItem[] {
  const monthBuckets = buildRecentFinanceMonthBuckets();
  const monthlyPaidOffAmount = createMonthlyValues();

  loanItems.forEach((item) => {
    const monthIndex = findFinanceMonthBucketIndex(monthBuckets, item.createdAt);

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
