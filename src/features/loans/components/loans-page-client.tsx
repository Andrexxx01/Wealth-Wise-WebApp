"use client";

import { useState } from "react";
import { BarChartMock } from "@/components/dashboard/bar-chart-mock";
import ChartCard from "@/components/dashboard/chart-card";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LOAN_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { useFinance } from "@/features/finance/components/finance-provider";
import { useFinanceSummary } from "@/features/finance/hooks/use-finance-summary";
import AddLoanDialog from "@/features/loans/components/add-loan-dialog";
import {
  buildLoanAccounts,
  sortUpcomingLoanPayments,
} from "@/lib/finance-calculations";
import { buildLoanSummaryCards } from "@/lib/finance-summary-cards";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/formatters";
import { mockLoanPayoffBars } from "@/lib/mock-data/loan";

function formatLoanCategory(category: string) {
  const categoryOption = LOAN_CATEGORY_OPTIONS.find(
    (option) => option.value === category,
  );

  return categoryOption?.label ?? category;
}

function formatLoanStatus(status: string) {
  const statusLabels: Record<string, string> = {
    ACTIVE: "Active",
    PAID_OFF: "Paid Off",
    OVERDUE: "Overdue",
  };

  return statusLabels[status] ?? status;
}

const loanPayoffChartData = mockLoanPayoffBars.map((item) => ({
  label: item.month,
  value: item.value,
}));

export default function LoansPageClient() {
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);

  const { loanItems, createLoan } = useFinance();

  const {
    totalLoanBalance,
    monthlyLoanPayment,
    totalPaidOff,
    debtToIncomeRatio,
  } = useFinanceSummary();

  const loanSummaryCards = buildLoanSummaryCards({
    totalLoanBalance,
    monthlyLoanPayment,
    totalPaidOff,
    debtToIncomeRatio,
  });

  const loanAccounts = buildLoanAccounts(loanItems);
  const upcomingPayments = sortUpcomingLoanPayments(loanItems, 4);

  return (
    <>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Loan Overview"
          title="Manage debt with more clarity"
          description="Keep track of outstanding balances, monthly obligations, and payoff progress so your debt stays visible and under control."
          action={
            <Button
              type="button"
              onClick={() => setIsAddLoanOpen(true)}
              className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
            >
              Add Loan
            </Button>
          }
        />

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {loanSummaryCards.map((card) => (
            <SummaryCard
              key={card.label}
              label={card.label}
              value={card.value}
              helper={card.helper}
              tone={card.tone}
            />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <ChartCard
            eyebrow="Loan Payoff Progress"
            title="Repayment Trend"
            badge="2026"
          >
            <BarChartMock data={loanPayoffChartData} />
          </ChartCard>

          <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
            <CardContent className="p-6">
              <DashboardCardHeader
                eyebrow="Loan Accounts"
                title="Active Debt List"
              />

              <div className="space-y-4">
                {loanAccounts.map((item) => (
                  <DashboardListItem
                    key={item.id}
                    title={item.title}
                    subtitle={formatLoanCategory(item.category)}
                    value={formatCurrency(item.remainingBalance)}
                    meta={`${formatCurrency(item.monthlyPayment)}/mo`}
                    className="border-none bg-slate-50 p-4"
                  >
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-slate-500">Payoff progress</span>

                        <span className="font-semibold text-slate-900">
                          {formatPercentage(item.progress)}
                        </span>
                      </div>

                      <div className="h-3 rounded-full bg-slate-200">
                        <div
                          className="h-3 rounded-full bg-emerald-500"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>

                      <p className="mt-3 text-sm font-medium text-emerald-600">
                        {formatLoanStatus(item.status)}
                      </p>
                    </div>
                  </DashboardListItem>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
            <CardContent className="p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <DashboardCardHeader
                  eyebrow="Upcoming Payments"
                  title="Next Loan Obligations"
                  className="mb-0"
                />

                <Button
                  variant="outline"
                  className="h-11 rounded-2xl border-slate-300 bg-white px-5 font-semibold text-slate-900 hover:bg-slate-100"
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {upcomingPayments.map((item) => (
                  <DashboardListItem
                    key={item.id}
                    title={item.title}
                    subtitle={item.lenderName}
                    value={formatCurrency(item.monthlyPayment)}
                    meta={
                      item.dueDate
                        ? `Due ${formatDate(item.dueDate)}`
                        : "No due date"
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <AddLoanDialog
        open={isAddLoanOpen}
        onOpenChange={setIsAddLoanOpen}
        onCreateLoan={createLoan}
      />
    </>
  );
}
