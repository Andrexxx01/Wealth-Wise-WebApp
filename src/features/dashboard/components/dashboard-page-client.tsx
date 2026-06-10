"use client";

import Link from "next/link";
import { GroupedBarChartMock } from "@/components/dashboard/bar-chart-mock";
import ChartCard from "@/components/dashboard/chart-card";
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
  buildCashFlowChartData,
  buildQuickSnapshotItems,
} from "@/lib/finance-dashboard";
import { buildDashboardSummaryCards } from "@/lib/finance-summary-cards";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/formatters";
import { mockUserProfile } from "@/lib/mock-data/user";

function getFirstName(fullName: string) {
  return fullName.split(" ")[0] ?? fullName;
}

export default function DashboardPageClient() {
  const { incomeItems, expenseItems, investmentItems, loanItems } =
    useFinance();

  const {
    totalIncome,
    totalExpenses,
    monthlySurplus,
    savingsRate,
    portfolioValue,
    totalInvested,
    netGain,
    totalLoanBalance,
    netWorth,
    recurringIncome,
    essentialSpending,
    recentActivity,
    financialHealthScore,
  } = useFinanceSummary();

  const hasCashFlowData = incomeItems.length > 0 || expenseItems.length > 0;
  const hasAnyFinanceData =
    incomeItems.length > 0 ||
    expenseItems.length > 0 ||
    investmentItems.length > 0 ||
    loanItems.length > 0;

  const summaryCards = buildDashboardSummaryCards({
    netWorth,
    totalIncome,
    totalExpenses,
    portfolioValue,
  });

  const quickSnapshotItems = buildQuickSnapshotItems({
    totalInvested,
    netGain,
    recurringIncome,
    essentialSpending,
  });

  const cashFlowChartData = buildCashFlowChartData({
    incomeItems,
    expenseItems,
  });

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Overview"
        title={`Welcome back, ${getFirstName(mockUserProfile.fullName)}`}
        description="Here's a quick view of your financial health, monthly cash flow, investment performance, and current debt position."
      />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            helper={card.helper}
            tone={card.tone}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ChartCard
          eyebrow="Monthly Cash Flow"
          title="Income vs Expense"
          badge="2026"
        >
          {hasCashFlowData ? (
            <GroupedBarChartMock
              data={cashFlowChartData}
              primaryLabel="Income"
              secondaryLabel="Expense"
            />
          ) : (
            <EmptyState
              title="No cash flow data yet"
              description="Add income or expense records to start building your monthly cash flow chart."
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
        </ChartCard>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Financial Health Score"
              title={`${financialHealthScore.score}%`}
              description={financialHealthScore.label}
            />

            {hasAnyFinanceData ? (
              <>
                <div className="rounded-[28px] bg-linear-to-r from-emerald-500 to-green-600 p-6 text-white">
                  <h3 className="text-5xl font-bold">
                    {financialHealthScore.score}%
                  </h3>

                  <p className="mt-3 text-sm text-emerald-50">
                    {financialHealthScore.summary}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <DashboardListItem
                    title="Monthly Surplus"
                    subtitle="Income minus expenses"
                    value={formatCurrency(monthlySurplus)}
                    tone={monthlySurplus >= 0 ? "positive" : "danger"}
                    className="border-none bg-slate-50 p-4"
                  />

                  <DashboardListItem
                    title="Savings Rate"
                    subtitle="Current monthly ratio"
                    value={formatPercentage(savingsRate)}
                    tone={savingsRate >= 0 ? "positive" : "danger"}
                    className="border-none bg-slate-50 p-4"
                  />

                  <DashboardListItem
                    title="Debt Balance"
                    subtitle="Outstanding liabilities"
                    value={formatCurrency(totalLoanBalance)}
                    className="border-none bg-slate-50 p-4"
                  />
                </div>
              </>
            ) : (
              <EmptyState
                title="No financial score yet"
                description="Add income, expenses, investments, or loans so WealthWise can calculate your financial health score."
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
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Quick Financial Snapshot"
              title="Current Position"
            />

            {hasAnyFinanceData ? (
              <div className="space-y-4">
                {quickSnapshotItems.map((item) => (
                  <DashboardListItem
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    value={item.value}
                    meta={item.meta}
                    tone={item.tone}
                    className="border-none bg-slate-50 p-4"
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No snapshot yet"
                description="Your income, investment, and essential spending snapshot will appear after you add financial records."
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
              eyebrow="Recent Activity"
              title="Latest Financial Records"
            />

            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <DashboardListItem
                    key={`${item.type}-${item.id}`}
                    title={item.title}
                    subtitle={item.type}
                    value={`${item.amount >= 0 ? "+" : ""}${formatCurrency(
                      item.amount,
                    )}`}
                    meta={formatDate(item.date)}
                    tone={item.amount >= 0 ? "positive" : "default"}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No recent activity yet"
                description="Your latest income and expense records will appear here after you start tracking transactions."
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
    </div>
  );
}
