"use client";

import Link from "next/link";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/features/auth/components/current-user-provider";
import { useFinance } from "@/features/finance/components/finance-provider";
import { useFinanceSummary } from "@/features/finance/hooks/use-finance-summary";
import PlanBadge from "@/features/subscription/components/plan-badge";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import type { SummaryCardProps } from "@/types/ui";
import type { SubscriptionStatus } from "@/types/user-subscription";
import AccountUsageSection from "@/features/subscription/components/account-usage-section";

function formatSubscriptionStatus(status: SubscriptionStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getRecordLimitLabel(plan: "FREE" | "PRO") {
  if (plan === "PRO") {
    return "Unlimited records";
  }

  return "50 records per finance category";
}

function getSubscriptionDescription(
  plan: "FREE" | "PRO",
  status: SubscriptionStatus,
) {
  if (plan === "PRO" && status === "ACTIVE") {
    return "Your Pro subscription is active.";
  }

  if (plan === "PRO") {
    return `Pro plan with ${formatSubscriptionStatus(status)} status.`;
  }

  return "Your account currently uses the Free plan.";
}

export default function SettingsPageClient() {
  const { currentUser } = useCurrentUser();

  const { incomeItems, expenseItems, investmentItems, loanItems } =
    useFinance();

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

  const subscriptionDescription = getSubscriptionDescription(
    currentUser.plan,
    currentUser.subscriptionStatus,
  );

  const dataSummaryCards: SummaryCardProps[] = [
    {
      label: "Total Records",
      value: String(totalRecords),
      helper: "All records stored in Neon",
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
      helper: "Income compared with expenses",
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
        description="Review your account, subscription plan, database configuration, and current WealthWise application status."
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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Account"
              title="Account and subscription"
              description="Your account information is loaded from the authenticated user session."
            />

            <div className="mb-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {currentUser.name}
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-slate-500">
                    {currentUser.email || "No email available"}
                  </p>
                </div>

                <PlanBadge plan={currentUser.plan} />
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                {subscriptionDescription}
              </p>
            </div>

            <div className="space-y-4">
              <DashboardListItem
                title="Account Plan"
                value={`${currentUser.plan} Plan`}
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Subscription Status"
                value={formatSubscriptionStatus(currentUser.subscriptionStatus)}
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Record Limit"
                value={getRecordLimitLabel(currentUser.plan)}
                meta={
                  currentUser.plan === "FREE"
                    ? "Applies separately to income, expenses, investments, and loans"
                    : "Pro users are not limited by record count"
                }
                className="border-none bg-slate-50 p-5"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Data Storage"
              title="Cloud database configuration"
              description="Financial records are stored persistently and separated by authenticated user."
            />

            <div className="space-y-4">
              <DashboardListItem
                title="Database"
                value="Neon PostgreSQL"
                meta="Persistent managed PostgreSQL database"
                tone="positive"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Database Access"
                value="Prisma ORM"
                meta="Server-side database queries through API routes"
                tone="positive"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Data Scope"
                value="Current user only"
                meta="Every finance record is linked to your authenticated user ID"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Persistence"
                value="Cloud synchronized"
                meta="Records remain available after browser refresh or device changes"
                className="border-none bg-slate-50 p-5"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <AccountUsageSection />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="App Preferences"
              title="Current display preferences"
              description="These are the current application defaults. Editable preferences can be added in a later phase."
            />

            <div className="space-y-4">
              <DashboardListItem
                title="Theme"
                value="Light Mode"
                meta="Dark mode is planned for a later phase"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Currency"
                value={currentUser.currency}
                meta="Your account currency preference"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Account Mode"
                value={
                  currentUser.plan === "PRO" ? "Pro Account" : "Free Account"
                }
                meta={getRecordLimitLabel(currentUser.plan)}
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Authentication"
                value="Auth.js Session"
                meta="Account access is protected by authenticated sessions"
                tone="positive"
                className="border-none bg-slate-50 p-5"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="System Status"
              title="Application integration status"
              description="The core WealthWise frontend and backend services are now connected."
            />

            <div className="space-y-4">
              <DashboardListItem
                title="Dashboard UI"
                value="Ready"
                tone="positive"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Finance CRUD"
                value="Connected"
                meta="Create, read, update, and delete through API routes"
                tone="positive"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Backend API"
                value="Active"
                meta="Next.js route handlers connected to Prisma"
                tone="positive"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Authentication"
                value="Active"
                meta="Registration, credentials login, sessions, and protected routes"
                tone="positive"
                className="border-none bg-slate-50 p-5"
              />

              <DashboardListItem
                title="Subscription Billing"
                value="Planned"
                meta="Stripe Checkout and webhook integration will be added later"
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
              title="Financial records stored in Neon"
              description="Record totals and financial values for the currently authenticated user."
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
