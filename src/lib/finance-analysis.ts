import { formatCurrency, formatPercentage } from "@/lib/formatters";

export type FinanceInsightTone = "positive" | "warning" | "neutral";

type BuildAnalysisDataParams = {
  totalIncome: number;
  totalExpenses: number;
  monthlySurplus: number;
  savingsRate: number;
  portfolioValue: number;
  netGain: number;
  investmentReturnRate: number;
  totalLoanBalance: number;
  debtToIncomeRatio: number;
  netWorth: number;
};

export function buildHealthMetrics({
  savingsRate,
  debtToIncomeRatio,
  netWorth,
  investmentReturnRate,
}: Pick<
  BuildAnalysisDataParams,
  "savingsRate" | "debtToIncomeRatio" | "netWorth" | "investmentReturnRate"
>) {
  return [
    {
      label: "Savings Rate",
      value: formatPercentage(savingsRate),
      helper: "Monthly surplus compared to income",
    },
    {
      label: "Debt Ratio",
      value: formatPercentage(debtToIncomeRatio),
      helper: "Monthly debt payment compared to income",
    },
    {
      label: "Net Worth",
      value: formatCurrency(netWorth),
      helper: "Surplus + investments - loan balance",
    },
    {
      label: "Investment Return",
      value: formatPercentage(investmentReturnRate),
      helper: "Current gain compared to invested capital",
    },
  ];
}

export function buildMonthlyReview({
  totalIncome,
  totalExpenses,
  monthlySurplus,
  totalLoanBalance,
}: Pick<
  BuildAnalysisDataParams,
  "totalIncome" | "totalExpenses" | "monthlySurplus" | "totalLoanBalance"
>) {
  return [
    {
      title: "Income",
      value: formatCurrency(totalIncome),
      helper: "Total money received this month.",
    },
    {
      title: "Expenses",
      value: formatCurrency(totalExpenses),
      helper: "Total spending recorded this month.",
    },
    {
      title: "Monthly Surplus",
      value: formatCurrency(monthlySurplus),
      helper:
        monthlySurplus >= 0
          ? "You are spending less than your income."
          : "Your expenses are higher than your income.",
    },
    {
      title: "Debt Balance",
      value: formatCurrency(totalLoanBalance),
      helper: "Total remaining loan balance.",
    },
  ];
}

export function buildFinancialInsights({
  monthlySurplus,
  savingsRate,
  debtToIncomeRatio,
  portfolioValue,
  netGain,
}: Pick<
  BuildAnalysisDataParams,
  | "monthlySurplus"
  | "savingsRate"
  | "debtToIncomeRatio"
  | "portfolioValue"
  | "netGain"
>) {
  return [
    {
      id: "cash-flow",
      title:
        monthlySurplus >= 0
          ? "Positive cash flow"
          : "Negative cash flow warning",
      description:
        monthlySurplus >= 0
          ? `You currently have a monthly surplus of ${formatCurrency(
              monthlySurplus,
            )}. This gives you room to save, invest, or repay debt faster.`
          : `You currently have a monthly deficit of ${formatCurrency(
              Math.abs(monthlySurplus),
            )}. Review lifestyle spending and recurring expenses.`,
      tone: monthlySurplus >= 0 ? "positive" : "warning",
    },
    {
      id: "savings-rate",
      title:
        savingsRate >= 20
          ? "Healthy savings rate"
          : "Savings rate can be improved",
      description:
        savingsRate >= 20
          ? `Your savings rate is ${formatPercentage(
              savingsRate,
            )}, which shows strong monthly discipline.`
          : `Your savings rate is ${formatPercentage(
              savingsRate,
            )}. Try increasing the gap between income and expenses.`,
      tone: savingsRate >= 20 ? "positive" : "warning",
    },
    {
      id: "debt-risk",
      title:
        debtToIncomeRatio <= 35
          ? "Debt level looks manageable"
          : "Debt pressure is getting high",
      description:
        debtToIncomeRatio <= 35
          ? `Your debt ratio is ${formatPercentage(
              debtToIncomeRatio,
            )}, which is still manageable based on current income.`
          : `Your debt ratio is ${formatPercentage(
              debtToIncomeRatio,
            )}. Consider reducing monthly obligations or accelerating payoff.`,
      tone: debtToIncomeRatio <= 35 ? "positive" : "warning",
    },
    {
      id: "investment-growth",
      title:
        portfolioValue <= 0
          ? "No investment portfolio recorded yet"
          : netGain >= 0
            ? "Portfolio is growing"
            : "Portfolio value is down",
      description:
        portfolioValue > 0
          ? `Your portfolio value is ${formatCurrency(
              portfolioValue,
            )}, with total gain/loss of ${formatCurrency(netGain)}.`
          : "You have not recorded any investment portfolio yet.",
      tone:
        portfolioValue <= 0 ? "neutral" : netGain >= 0 ? "positive" : "warning",
    },
  ] satisfies Array<{
    id: string;
    title: string;
    description: string;
    tone: FinanceInsightTone;
  }>;
}

export function buildRecommendedActions() {
  return [
    {
      id: "budget-review",
      title: "Review expense categories weekly",
      description:
        "Use your expense breakdown to identify categories that can be reduced without hurting essential needs.",
    },
    {
      id: "surplus-plan",
      title: "Give every surplus a clear job",
      description:
        "Allocate monthly surplus into emergency fund, investments, or extra debt repayment instead of leaving it unplanned.",
    },
    {
      id: "debt-plan",
      title: "Prioritize high-interest debt",
      description:
        "If you have multiple loans, focus extra payments on the most expensive debt first.",
    },
  ];
}

export function buildFinancialHealthHighlights({
  savingsRate,
  monthlySurplus,
  debtToIncomeRatio,
  totalExpenses,
  totalIncome,
}: Pick<
  BuildAnalysisDataParams,
  | "savingsRate"
  | "monthlySurplus"
  | "debtToIncomeRatio"
  | "totalExpenses"
  | "totalIncome"
>) {
  const biggestStrength =
    savingsRate >= 20
      ? "Strong Savings Rate"
      : monthlySurplus >= 0
        ? "Positive Cash Flow"
        : "Needs More Surplus";

  const biggestStrengthTone =
    savingsRate >= 20 || monthlySurplus >= 0 ? "positive" : "warning";

  const mainWatchArea =
    debtToIncomeRatio > 35
      ? "Debt Pressure"
      : totalExpenses > totalIncome
        ? "Expense Control"
        : "Portfolio Growth";

  return {
    biggestStrength,
    biggestStrengthTone,
    mainWatchArea,
  } satisfies {
    biggestStrength: string;
    biggestStrengthTone: FinanceInsightTone;
    mainWatchArea: string;
  };
}