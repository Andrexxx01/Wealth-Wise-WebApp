"use client";

import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Card, CardContent } from "@/components/ui/card";
import { useFinanceSummary } from "@/features/finance/hooks/use-finance-summary";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import type { DashboardListItemTone } from "@/types/ui";

function getInsightToneClass(tone: string) {
  if (tone === "positive") return "bg-emerald-500";
  if (tone === "warning") return "bg-amber-500";

  return "bg-slate-400";
}

function getInsightToneLabel(tone: string) {
  if (tone === "positive") return "Positive";
  if (tone === "warning") return "Warning";

  return "Neutral";
}

function getInsightListTone(tone: string): DashboardListItemTone {
  if (tone === "positive") return "positive";
  if (tone === "warning") return "warning";

  return "default";
}

export default function AnalysisPageClient() {
  const {
    totalIncome,
    totalExpenses,
    monthlySurplus,
    savingsRate,
    portfolioValue,
    netGain,
    investmentReturnRate,
    totalLoanBalance,
    debtToIncomeRatio,
    netWorth,
    financialHealthScore,
  } = useFinanceSummary();

  const healthMetrics = [
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

  const monthlyReview = [
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

  const insights = [
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
  ];

  const recommendedActions = [
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

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Financial Analysis"
        title="Understand your financial health more clearly"
        description="WealthWise turns your income, expenses, investments, and loans into a clearer financial story so you can make smarter decisions with more confidence."
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Financial Health Score"
              title={`${financialHealthScore.score}%`}
              description={financialHealthScore.summary}
            />

            <div className="rounded-[28px] bg-linear-to-r from-emerald-500 to-green-600 p-8 text-white">
              <h2 className="text-6xl font-bold tracking-tight">
                {financialHealthScore.score}%
              </h2>

              <p className="mt-3 text-base text-emerald-50">
                {financialHealthScore.summary}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <DashboardListItem
                title="Current Assessment"
                value={financialHealthScore.label}
                className="border-none bg-slate-50 p-4"
              />

              <DashboardListItem
                title="Biggest Strength"
                value={
                  savingsRate >= 20
                    ? "Strong Savings Rate"
                    : monthlySurplus >= 0
                      ? "Positive Cash Flow"
                      : "Needs More Surplus"
                }
                tone={
                  savingsRate >= 20 || monthlySurplus >= 0
                    ? "positive"
                    : "warning"
                }
                className="border-none bg-slate-50 p-4"
              />

              <DashboardListItem
                title="Main Watch Area"
                value={
                  debtToIncomeRatio > 35
                    ? "Debt Pressure"
                    : totalExpenses > totalIncome
                      ? "Expense Control"
                      : "Portfolio Growth"
                }
                tone="warning"
                className="border-none bg-slate-50 p-4"
              />
            </div>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {healthMetrics.map((metric) => (
            <SummaryCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              helper={metric.helper}
            />
          ))}
        </section>
      </section>

      <section>
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Monthly Review"
              title="Key Financial Signals"
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {monthlyReview.map((item) => (
                <DashboardListItem
                  key={item.title}
                  title={item.title}
                  value={item.value}
                  meta={item.helper}
                  className="border-none bg-slate-50 p-5"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Insights"
              title="What your data is saying"
            />

            <div className="space-y-4">
              {insights.map((item) => (
                <DashboardListItem
                  key={item.id}
                  title={item.title}
                  value={getInsightToneLabel(item.tone)}
                  tone={getInsightListTone(item.tone)}
                >
                  <div className="flex gap-4">
                    <div
                      className={`mt-2 h-3 w-3 shrink-0 rounded-full ${getInsightToneClass(
                        item.tone,
                      )}`}
                    />

                    <p className="text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </DashboardListItem>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Recommended Actions"
              title="Next best steps"
            />

            <div className="space-y-4">
              {recommendedActions.map((item) => (
                <DashboardListItem
                  key={item.id}
                  title={item.title}
                  className="border-none bg-slate-50 p-5"
                >
                  <p className="text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </DashboardListItem>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
