"use client";

import Link from "next/link";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import EmptyState from "@/components/dashboard/empty-state";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/features/finance/components/finance-provider";
import { useFinanceSummary } from "@/features/finance/hooks/use-finance-summary";
import {
  buildFinancialHealthHighlights,
  buildFinancialInsights,
  buildHealthMetrics,
  buildMonthlyReview,
  buildRecommendedActions,
  type FinanceInsightTone,
} from "@/lib/finance-analysis";
import type { DashboardListItemTone } from "@/types/ui";

function getInsightToneClass(tone: FinanceInsightTone) {
  if (tone === "positive") return "bg-emerald-500";
  if (tone === "warning") return "bg-amber-500";

  return "bg-slate-400";
}

function getInsightToneLabel(tone: FinanceInsightTone) {
  if (tone === "positive") return "Positive";
  if (tone === "warning") return "Warning";

  return "Neutral";
}

function getInsightListTone(tone: FinanceInsightTone): DashboardListItemTone {
  if (tone === "positive") return "positive";
  if (tone === "warning") return "warning";

  return "default";
}

export default function AnalysisPageClient() {
  const { incomeItems, expenseItems, investmentItems, loanItems } =
    useFinance();

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

  const hasAnyFinanceData =
    incomeItems.length > 0 ||
    expenseItems.length > 0 ||
    investmentItems.length > 0 ||
    loanItems.length > 0;

  const healthMetrics = buildHealthMetrics({
    savingsRate,
    debtToIncomeRatio,
    netWorth,
    investmentReturnRate,
  });

  const monthlyReview = buildMonthlyReview({
    totalIncome,
    totalExpenses,
    monthlySurplus,
    totalLoanBalance,
  });

  const insights = buildFinancialInsights({
    monthlySurplus,
    savingsRate,
    debtToIncomeRatio,
    portfolioValue,
    netGain,
  });

  const recommendedActions = buildRecommendedActions();

  const financialHealthHighlights = buildFinancialHealthHighlights({
    savingsRate,
    monthlySurplus,
    debtToIncomeRatio,
    totalExpenses,
    totalIncome,
  });

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

            {hasAnyFinanceData ? (
              <>
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
                    value={financialHealthHighlights.biggestStrength}
                    tone={
                      financialHealthHighlights.biggestStrengthTone ===
                      "positive"
                        ? "positive"
                        : "warning"
                    }
                    className="border-none bg-slate-50 p-4"
                  />

                  <DashboardListItem
                    title="Main Watch Area"
                    value={financialHealthHighlights.mainWatchArea}
                    tone="warning"
                    className="border-none bg-slate-50 p-4"
                  />
                </div>
              </>
            ) : (
              <EmptyState
                title="No analysis yet"
                description="Add income, expenses, investments, or loans to generate your financial health analysis."
                action={
                  <Button
                    asChild
                    className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                  >
                    <Link href="/income">Start with Income</Link>
                  </Button>
                }
              />
            )}
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

            {hasAnyFinanceData ? (
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
            ) : (
              <EmptyState
                title="No monthly review yet"
                description="Your monthly income, expenses, surplus, and debt signals will appear after you add records."
                action={
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      asChild
                      className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                    >
                      <Link href="/income">Add Income</Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="h-11 rounded-2xl border-slate-300 bg-white px-5 font-semibold text-slate-900 hover:bg-slate-100"
                    >
                      <Link href="/expenses">Add Expense</Link>
                    </Button>
                  </div>
                }
              />
            )}
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

            {hasAnyFinanceData ? (
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
            ) : (
              <EmptyState
                title="No insights yet"
                description="WealthWise will generate insights once your financial records are available."
                action={
                  <Button
                    asChild
                    className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                  >
                    <Link href="/income">Add First Record</Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Recommended Actions"
              title="Next best steps"
            />

            {hasAnyFinanceData ? (
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
            ) : (
              <EmptyState
                title="No recommendations yet"
                description="Recommendations will become more useful after you add income, expenses, investments, and loan data."
                action={
                  <Button
                    asChild
                    className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                  >
                    <Link href="/income">Start Tracking</Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
