import { formatCurrency, formatPercentage } from "@/lib/formatters";
import type { SummaryCardProps } from "@/types/ui";

type BuildIncomeSummaryCardsParams = {
  totalIncome: number;
  recurringIncome: number;
  extraIncome: number;
  projectedAnnualIncome: number;
};

type BuildExpenseSummaryCardsParams = {
  totalExpenses: number;
  essentialSpending: number;
  lifestyleSpending: number;
  averageDailySpend: number;
};

type BuildInvestmentSummaryCardsParams = {
  portfolioValue: number;
  totalInvested: number;
  netGain: number;
  investmentReturnRate: number;
};

type BuildLoanSummaryCardsParams = {
  totalLoanBalance: number;
  monthlyLoanPayment: number;
  totalPaidOff: number;
  debtToIncomeRatio: number;
};

export function buildIncomeSummaryCards({
  totalIncome,
  recurringIncome,
  extraIncome,
  projectedAnnualIncome,
}: BuildIncomeSummaryCardsParams): SummaryCardProps[] {
  return [
    {
      label: "Total Income",
      value: formatCurrency(totalIncome),
      helper: "This month",
    },
    {
      label: "Recurring Income",
      value: formatCurrency(recurringIncome),
      helper: "Salary & fixed sources",
    },
    {
      label: "Extra Income",
      value: formatCurrency(extraIncome),
      helper: "Freelance & side projects",
    },
    {
      label: "Projected Annual",
      value: formatCurrency(projectedAnnualIncome),
      helper: "Estimated yearly income",
    },
  ];
}

export function buildExpenseSummaryCards({
  totalExpenses,
  essentialSpending,
  lifestyleSpending,
  averageDailySpend,
}: BuildExpenseSummaryCardsParams): SummaryCardProps[] {
  return [
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      helper: "This month",
    },
    {
      label: "Essential Spending",
      value: formatCurrency(essentialSpending),
      helper: "Needs & fixed costs",
    },
    {
      label: "Lifestyle Spending",
      value: formatCurrency(lifestyleSpending),
      helper: "Dining, shopping, fun",
    },
    {
      label: "Average Daily Spend",
      value: formatCurrency(averageDailySpend),
      helper: "Based on current month",
    },
  ];
}

export function buildInvestmentSummaryCards({
  portfolioValue,
  totalInvested,
  netGain,
  investmentReturnRate,
}: BuildInvestmentSummaryCardsParams): SummaryCardProps[] {
  return [
    {
      label: "Portfolio Value",
      value: formatCurrency(portfolioValue),
      helper: "Current total value",
    },
    {
      label: "Total Invested",
      value: formatCurrency(totalInvested),
      helper: "Total capital deployed",
    },
    {
      label: "Net Gain",
      value: formatCurrency(netGain),
      helper: "Overall return",
      tone: netGain >= 0 ? "positive" : "danger",
    },
    {
      label: "Return Rate",
      value: formatPercentage(investmentReturnRate),
      helper: "Based on current value",
      tone: investmentReturnRate >= 0 ? "positive" : "danger",
    },
  ];
}

export function buildLoanSummaryCards({
  totalLoanBalance,
  monthlyLoanPayment,
  totalPaidOff,
  debtToIncomeRatio,
}: BuildLoanSummaryCardsParams): SummaryCardProps[] {
  return [
    {
      label: "Total Loan Balance",
      value: formatCurrency(totalLoanBalance),
      helper: "Outstanding debt balance",
    },
    {
      label: "Monthly Payment",
      value: formatCurrency(monthlyLoanPayment),
      helper: "Required this month",
    },
    {
      label: "Paid Off",
      value: formatCurrency(totalPaidOff),
      helper: "Total repaid so far",
      tone: "positive",
    },
    {
      label: "Debt Ratio",
      value: formatPercentage(debtToIncomeRatio),
      helper: "Based on current income",
    },
  ];
}
