"use client";

import Link from "next/link";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import ResetDemoDataButton from "@/components/dashboard/reset-demo-data-button";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/features/finance/components/finance-provider";
import { useFinanceSummary } from "@/features/finance/hooks/use-finance-summary";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import type { SummaryCardProps } from "@/types/ui";

export default function SettingsPageClient() {
  const {
    incomeItems,
    expenseItems,
    investmentItems,
    loanItems,
    resetFinanceData,
  } = useFinance();

  const {
    netWorth,
    totalIncome,
    totalExpenses,
    portfolioValue,
    totalLoanBalance,
    savingsRate,
  } = useFinanceSummary();

  const totalRecords =
    incomeItems.length +
    expenseItems.length +
    investmentItems.length +
    loanItems.length;

  const dataSummaryCards: SummaryCardProps[] = [
    {
      label: "Total Records",
      value: String(totalRecords),
      helper: "All local finance records",
    },
    {
      label: "Net Worth",
      value: formatCurrency(netWorth),
      helper: "Assets minus liabilities",
      tone: netWorth >= 0 ? "positive" : "danger",
    },
    {
      label: "Savings Rate",
      value: formatPercentage(savingsRate),
      helper: "Income vs expenses",
      tone: savingsRate >= 0 ? "positive" : "danger",
    },
    {
      label: "Debt Balance",
      value: formatCurrency(totalLoanBalance),
      helper: "Outstanding loan balance",
    },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Settings"
        title="App settings"
        description="Manage temporary app preferences, local browser storage, demo data, and project status while WealthWise is still in frontend demo mode."
      />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dataSummaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            helper={card.helper}
            tone={card.tone}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Storage"
              title="Local browser persistence"
              description="WealthWise currently stores demo data in your browser using localStorage."
            />

            <div className="space-y-4">
              <DashboardListItem
                title="Storage Engine"
                value="localStorage"
                meta="Temporary frontend persistence"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Database"
                value="Not connected yet"
                meta="Prisma + PostgreSQL will be added later"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Data Scope"
                value="This browser only"
                meta="Data will not sync across devices yet"
                className="border-none bg-slate-50 p-5"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Reset Data"
              title="Restore demo records"
              description="Use this when you want to remove all local changes and return the app to the original mock data."
            />

            <DashboardListItem
              title="Reset Demo Data"
              value="Restore original data"
              meta="This removes added/deleted local records from your browser storage."
              className="border-none bg-slate-50 p-5"
            >
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-slate-500">
                  This action cannot be undone in the current demo mode.
                </p>

                <ResetDemoDataButton onReset={resetFinanceData} />
              </div>
            </DashboardListItem>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="App Preferences"
              title="Current demo preferences"
              description="These settings are still static for now. Later, they can be connected to real user preferences."
            />

            <div className="space-y-4">
              <DashboardListItem
                title="Theme"
                value="Light Mode"
                meta="Dark mode can be added later"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Currency"
                value="USD"
                meta="Formatting currently uses currency helper"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Chart Range"
                value="January - June"
                meta="Current demo chart window"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Account Mode"
                value="Demo Account"
                meta="Authentication will be connected later"
                className="border-none bg-slate-50 p-5"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Project Status"
              title="Frontend demo progress"
              description="This section explains what already works and what still needs backend integration."
            />

            <div className="space-y-4">
              <DashboardListItem
                title="Dashboard UI"
                value="Ready"
                tone="positive"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="CRUD Demo"
                value="Create & Delete"
                meta="Using React state + localStorage"
                tone="positive"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Backend API"
                value="Pending"
                meta="Next phase: Prisma, PostgreSQL, auth, and API routes"
                tone="warning"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Production Auth"
                value="Pending"
                meta="Login/register modal will connect to real auth later"
                tone="warning"
                className="border-none bg-slate-50 p-5"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Current Data Snapshot"
              title="Financial data stored locally"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DashboardListItem
                title="Income Records"
                value={String(incomeItems.length)}
                meta={formatCurrency(totalIncome)}
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Expense Records"
                value={String(expenseItems.length)}
                meta={formatCurrency(totalExpenses)}
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Investment Records"
                value={String(investmentItems.length)}
                meta={formatCurrency(portfolioValue)}
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Loan Records"
                value={String(loanItems.length)}
                meta={formatCurrency(totalLoanBalance)}
                className="border-none bg-slate-50 p-5"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
              >
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 rounded-2xl border-slate-300 bg-white px-6 font-semibold text-slate-900 hover:bg-slate-100"
              >
                <Link href="/profile">View Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
