"use client";

import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Card, CardContent } from "@/components/ui/card";
import { useFinanceSummary } from "@/features/finance/hooks/use-finance-summary";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import { mockUserProfile } from "@/lib/mock-data/user";
import type { SummaryCardProps } from "@/types/ui";

const profileEmail = "andre@wealthwise.demo";
const memberSince = "2026";

function getInitials(fullName: string) {
  const words = fullName.trim().split(" ").filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function ProfilePageClient() {
  const {
    netWorth,
    totalIncome,
    totalExpenses,
    portfolioValue,
    totalLoanBalance,
    savingsRate,
    financialHealthScore,
  } = useFinanceSummary();

  const initials = getInitials(mockUserProfile.fullName);

  const profileSummaryCards: SummaryCardProps[] = [
    {
      label: "Net Worth",
      value: formatCurrency(netWorth),
      helper: "Assets minus liabilities",
      tone: netWorth >= 0 ? "positive" : "danger",
    },
    {
      label: "Savings Rate",
      value: formatPercentage(savingsRate),
      helper: "Current monthly ratio",
      tone: savingsRate >= 0 ? "positive" : "danger",
    },
    {
      label: "Portfolio Value",
      value: formatCurrency(portfolioValue),
      helper: "Current investment value",
      tone: portfolioValue > 0 ? "positive" : "default",
    },
    {
      label: "Debt Balance",
      value: formatCurrency(totalLoanBalance),
      helper: "Outstanding liabilities",
    },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Profile"
        title="Your profile"
        description="Manage your demo account information and review your current WealthWise financial overview."
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-emerald-600 text-3xl font-black text-white shadow-lg shadow-emerald-100">
                {initials}
              </div>

              <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
                {mockUserProfile.fullName}
              </h2>

              <p className="mt-2 text-sm font-medium text-slate-500">
                {profileEmail}
              </p>

              <div className="mt-5 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                Demo Account
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <DashboardListItem
                title="Member Since"
                value={memberSince}
                className="border-none bg-slate-50 p-4"
              />

              <DashboardListItem
                title="Account Type"
                value="Personal Finance Demo"
                className="border-none bg-slate-50 p-4"
              />

              <DashboardListItem
                title="Storage"
                value="Local Browser Storage"
                meta="Temporary persistence layer"
                className="border-none bg-slate-50 p-4"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Account Summary"
              title="Financial profile overview"
              description="A quick summary of your current financial data inside WealthWise."
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {profileSummaryCards.map((card) => (
                <SummaryCard
                  key={card.label}
                  label={card.label}
                  value={card.value}
                  helper={card.helper}
                  tone={card.tone}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Financial Health"
              title={`${financialHealthScore.score}%`}
              description={financialHealthScore.summary}
            />

            <div className="rounded-[28px] bg-linear-to-r from-emerald-500 to-green-600 p-6 text-white">
              <p className="text-sm font-semibold text-emerald-50">
                Current Assessment
              </p>

              <h3 className="mt-2 text-4xl font-black">
                {financialHealthScore.label}
              </h3>

              <p className="mt-3 text-sm leading-6 text-emerald-50">
                {financialHealthScore.summary}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Monthly Activity"
              title="Income vs Expenses"
            />

            <div className="space-y-4">
              <DashboardListItem
                title="Monthly Income"
                value={formatCurrency(totalIncome)}
                tone="positive"
                className="border-none bg-slate-50 p-4"
              />

              <DashboardListItem
                title="Monthly Expenses"
                value={formatCurrency(totalExpenses)}
                className="border-none bg-slate-50 p-4"
              />

              <DashboardListItem
                title="Current Balance"
                value={formatCurrency(totalIncome - totalExpenses)}
                tone={totalIncome - totalExpenses >= 0 ? "positive" : "danger"}
                className="border-none bg-slate-50 p-4"
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
