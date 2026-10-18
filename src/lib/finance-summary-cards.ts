import { formatCurrency, formatPercentage } from "@/lib/formatters";
import type { SummaryCardProps } from "@/types/ui";
import type { UserCurrency } from "@/types/user-subscription";

type BuildIncomeSummaryCardsParams = {
  totalIncome: number;
  recurringIncome: number;
  extraIncome: number;
  projectedAnnualIncome: number;
  currency: UserCurrency;
};

type BuildExpenseSummaryCardsParams = {
  totalExpenses: number;
  essentialSpending: number;
  lifestyleSpending: number;
  averageDailySpend: number;
  currency: UserCurrency;
};

type BuildInvestmentSummaryCardsParams = {
  totalInvested: number;
  totalFees: number;
  totalCashOutflow: number;
  transactionCount: number;
  currency: UserCurrency;
  isCurrencyConversionReady: boolean;
};

type BuildLoanSummaryCardsParams = {
  totalLoanBalance: number;
  monthlyLoanPayment: number;
  totalPaidOff: number;
  debtToIncomeRatio: number | null;
  currency: UserCurrency;
};

type BuildDashboardSummaryCardsParams = {
  netWorth: number;
  totalIncome: number;
  totalExpenses: number;
  portfolioValue: number;
  currency: UserCurrency;
};

export function buildIncomeSummaryCards({
  totalIncome,
  recurringIncome,
  extraIncome,
  projectedAnnualIncome,
  currency,
}: BuildIncomeSummaryCardsParams): SummaryCardProps[] {
  return [
    {
      label: "Total Income",
      value: formatCurrency(totalIncome, currency),
      helper: "This month",
    },
    {
      label: "Recurring Income",
      value: formatCurrency(recurringIncome, currency),
      helper: "This month",
    },
    {
      label: "Extra Income",
      value: formatCurrency(extraIncome, currency),
      helper: "This month",
    },
    {
      label: "Projected Annual",
      value: formatCurrency(projectedAnnualIncome, currency),
      helper: "Current-month run rate × 12",
    },
  ];
}

export function buildExpenseSummaryCards({
  totalExpenses,
  essentialSpending,
  lifestyleSpending,
  averageDailySpend,
  currency,
}: BuildExpenseSummaryCardsParams): SummaryCardProps[] {
  return [
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses, currency),
      helper: "This month",
    },
    {
      label: "Essential Spending",
      value: formatCurrency(essentialSpending, currency),
      helper: "This month",
    },
    {
      label: "Lifestyle Spending",
      value: formatCurrency(lifestyleSpending, currency),
      helper: "This month",
    },
    {
      label: "Average Daily Spend",
      value: formatCurrency(averageDailySpend, currency),
      helper: "Based on elapsed days this month",
    },
  ];
}

export function buildInvestmentSummaryCards({
  totalInvested,
  totalFees,
  totalCashOutflow,
  transactionCount,
  currency,
  isCurrencyConversionReady,
}: BuildInvestmentSummaryCardsParams): SummaryCardProps[] {
  return [
    {
      label: "Total Invested",
      value: isCurrencyConversionReady
        ? formatCurrency(totalInvested, currency)
        : "—",
      helper: "Capital used to purchase assets",
    },
    {
      label: "Total Fees",
      value: isCurrencyConversionReady
        ? formatCurrency(totalFees, currency)
        : "—",
      helper: "Investment transaction costs",
    },
    {
      label: "Cash Outflow",
      value: isCurrencyConversionReady
        ? formatCurrency(totalCashOutflow, currency)
        : "—",
      helper: "Net investment cash flow this month",
    },
    {
      label: "Transactions",
      value: String(transactionCount),
      helper: "Investment records",
    },
  ];
}

export function buildLoanSummaryCards({
  totalLoanBalance,
  monthlyLoanPayment,
  totalPaidOff,
  debtToIncomeRatio,
  currency,
}: BuildLoanSummaryCardsParams): SummaryCardProps[] {
  return [
    {
      label: "Total Loan Balance",
      value: formatCurrency(totalLoanBalance, currency),
      helper: "Outstanding debt balance",
    },
    {
      label: "Monthly Payment",
      value: formatCurrency(monthlyLoanPayment, currency),
      helper: "Required this month",
    },
    {
      label: "Paid Off",
      value: formatCurrency(totalPaidOff, currency),
      helper: "Total repaid so far",
      tone: "positive",
    },
    {
      label: "Debt Ratio",
      value:
        debtToIncomeRatio === null
          ? "—"
          : formatPercentage(debtToIncomeRatio),
      helper:
        debtToIncomeRatio === null
          ? "Requires monthly income"
          : "Based on current-month income",
    },
  ];
}

export function buildDashboardSummaryCards({
  netWorth,
  totalIncome,
  totalExpenses,
  portfolioValue,
  currency,
}: BuildDashboardSummaryCardsParams): SummaryCardProps[] {
  return [
    {
      label: "Net Worth",
      value: formatCurrency(netWorth, currency),
      helper: "Assets minus liabilities",
      tone: netWorth >= 0 ? "positive" : "danger",
    },
    {
      label: "Monthly Income",
      value: formatCurrency(totalIncome, currency),
      helper: "Total income this month",
      tone: "positive",
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(totalExpenses, currency),
      helper: "Total spending this month",
    },
    {
      label: "Portfolio Value",
      value: formatCurrency(portfolioValue, currency),
      helper: "Current investment value",
      tone: portfolioValue > 0 ? "positive" : "default",
    },
  ];
}
