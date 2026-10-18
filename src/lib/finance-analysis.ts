import { formatCurrency, formatPercentage } from "@/lib/formatters";
import type { UserCurrency } from "@/types/user-subscription";

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
  debtToIncomeRatio: number | null;
  netWorth: number;
  currency: UserCurrency;
};

export function buildHealthMetrics({
  totalIncome,
  savingsRate,
  debtToIncomeRatio,
  netWorth,
  portfolioValue,
  investmentReturnRate,
  currency,
}: Pick<
  BuildAnalysisDataParams,
  | "totalIncome"
  | "savingsRate"
  | "debtToIncomeRatio"
  | "netWorth"
  | "portfolioValue"
  | "investmentReturnRate"
  | "currency"
>) {
  return [
    {
      label: "Savings Rate",
      value: totalIncome > 0 ? formatPercentage(savingsRate) : "—",
      helper:
        totalIncome > 0
          ? "Monthly surplus compared to income"
          : "Requires monthly income",
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
          : "Monthly debt payment compared to income",
    },
    {
      label: "Net Worth",
      value: formatCurrency(netWorth, currency),
      helper: "Surplus + investments - loan balance",
    },
    {
      label: "Investment Return",
      value:
        portfolioValue > 0 ? formatPercentage(investmentReturnRate) : "—",
      helper:
        portfolioValue > 0
          ? "Current unrealized portfolio return"
          : "Requires a valued open portfolio",
    },
  ];
}

export function buildMonthlyReview({
  totalIncome,
  totalExpenses,
  monthlySurplus,
  totalLoanBalance,
  currency,
}: Pick<
  BuildAnalysisDataParams,
  | "totalIncome"
  | "totalExpenses"
  | "monthlySurplus"
  | "totalLoanBalance"
  | "currency"
>) {
  return [
    {
      title: "Income",
      value: formatCurrency(totalIncome, currency),
      helper: "Total money received this month.",
    },
    {
      title: "Expenses",
      value: formatCurrency(totalExpenses, currency),
      helper: "Total spending recorded this month.",
    },
    {
      title: "Monthly Surplus",
      value: formatCurrency(monthlySurplus, currency),
      helper:
        monthlySurplus >= 0
          ? "You are spending less than your income."
          : "Your expenses are higher than your income.",
    },
    {
      title: "Debt Balance",
      value: formatCurrency(totalLoanBalance, currency),
      helper: "Total remaining loan balance.",
    },
  ];
}

export function buildFinancialInsights({
  totalIncome,
  totalExpenses,
  monthlySurplus,
  savingsRate,
  debtToIncomeRatio,
  portfolioValue,
  netGain,
  currency,
}: Pick<
  BuildAnalysisDataParams,
  | "totalIncome"
  | "totalExpenses"
  | "monthlySurplus"
  | "savingsRate"
  | "debtToIncomeRatio"
  | "portfolioValue"
  | "netGain"
  | "currency"
>) {
  const debtInsight =
    debtToIncomeRatio === null
      ? {
          id: "debt-risk",
          title: "Debt ratio unavailable",
          description:
            "Add current-month income so WealthWise can compare monthly debt payments with income accurately.",
          tone: "neutral" as const,
        }
      : debtToIncomeRatio <= 35
        ? {
            id: "debt-risk",
            title: "Debt level looks manageable",
            description: `Your debt ratio is ${formatPercentage(
              debtToIncomeRatio,
            )}, which is still manageable based on current-month income.`,
            tone: "positive" as const,
          }
        : {
            id: "debt-risk",
            title: "Debt pressure is getting high",
            description: `Your debt ratio is ${formatPercentage(
              debtToIncomeRatio,
            )}. Consider reducing monthly obligations or accelerating payoff.`,
            tone: "warning" as const,
          };

  const cashFlowInsight =
    totalIncome <= 0 && totalExpenses <= 0
      ? {
          id: "cash-flow",
          title: "No monthly cash-flow data yet",
          description:
            "Add income or expense records for the current month to evaluate monthly cash flow.",
          tone: "neutral" as const,
        }
      : monthlySurplus >= 0
        ? {
            id: "cash-flow",
            title: "Positive cash flow",
            description: `You currently have a monthly surplus of ${formatCurrency(
              monthlySurplus,
              currency,
            )}. This gives you room to save, invest, or repay debt faster.`,
            tone: "positive" as const,
          }
        : {
            id: "cash-flow",
            title: "Negative cash flow warning",
            description: `You currently have a monthly deficit of ${formatCurrency(
              Math.abs(monthlySurplus),
              currency,
            )}. Review lifestyle spending and recurring expenses.`,
            tone: "warning" as const,
          };

  const savingsInsight =
    totalIncome <= 0
      ? {
          id: "savings-rate",
          title: "Savings rate unavailable",
          description:
            "Add current-month income so WealthWise can calculate your savings rate accurately.",
          tone: "neutral" as const,
        }
      : savingsRate >= 20
        ? {
            id: "savings-rate",
            title: "Healthy savings rate",
            description: `Your savings rate is ${formatPercentage(
              savingsRate,
            )}, which shows strong monthly discipline.`,
            tone: "positive" as const,
          }
        : {
            id: "savings-rate",
            title: "Savings rate can be improved",
            description: `Your savings rate is ${formatPercentage(
              savingsRate,
            )}. Try increasing the gap between income and expenses.`,
            tone: "warning" as const,
          };

  return [
    cashFlowInsight,
    savingsInsight,
    debtInsight,
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
              currency,
            )}, with total gain/loss of ${formatCurrency(netGain, currency)}.`
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
  const hasMonthlyIncome = totalIncome > 0;

  const biggestStrength = !hasMonthlyIncome
    ? "Income Data Needed"
    : savingsRate >= 20
      ? "Strong Savings Rate"
      : monthlySurplus >= 0
        ? "Positive Cash Flow"
        : "Needs More Surplus";

  const biggestStrengthTone: FinanceInsightTone = !hasMonthlyIncome
    ? "neutral"
    : savingsRate >= 20 || monthlySurplus >= 0
      ? "positive"
      : "warning";

  const mainWatchArea =
    debtToIncomeRatio === null
      ? "Income Coverage"
      : debtToIncomeRatio > 35
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
