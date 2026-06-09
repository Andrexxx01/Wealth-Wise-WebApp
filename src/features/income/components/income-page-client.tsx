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
import { useFinance } from "@/features/finance/components/finance-provider";
import { useFinanceSummary } from "@/features/finance/hooks/use-finance-summary";
import AddIncomeDialog from "@/features/income/components/add-income-dialog";
import { buildMonthlyIncomeChartData } from "@/lib/finance-charts";
import { sortRecentIncomeItems } from "@/lib/finance-calculations";
import { buildIncomeSummaryCards } from "@/lib/finance-summary-cards";
import { formatCurrency, formatDate, formatEnumLabel } from "@/lib/formatters";

function formatIncomeFrequency(frequency: string) {
  if (frequency === "ONE_TIME") return "Irregular";

  return formatEnumLabel(frequency);
}

export default function IncomePageClient() {
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);

  const { incomeItems, createIncome } = useFinance();

  const { totalIncome, recurringIncome, extraIncome, projectedAnnualIncome } =
    useFinanceSummary();

  const incomeSummaryCards = buildIncomeSummaryCards({
    totalIncome,
    recurringIncome,
    extraIncome,
    projectedAnnualIncome,
  });

  const monthlyIncomeChartData = buildMonthlyIncomeChartData({
    incomeItems,
  });

  const incomeSources = incomeItems.map((item) => ({
    id: item.id,
    name: item.title,
    amount: item.amount,
    frequency: formatIncomeFrequency(item.frequency),
  }));

  const recentIncome = sortRecentIncomeItems(incomeItems, 4);

  return (
    <>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Income Overview"
          title="Track your income clearly"
          description="Monitor salary, freelance payments, consulting revenue, and other income sources in one place so your financial analysis stays accurate."
          action={
            <Button
              type="button"
              onClick={() => setIsAddIncomeOpen(true)}
              className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
            >
              Add Income
            </Button>
          }
        />

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {incomeSummaryCards.map((card) => (
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
            eyebrow="Monthly Income Trend"
            title="Income Growth"
            badge="2026"
          >
            <BarChartMock data={monthlyIncomeChartData} />
          </ChartCard>

          <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
            <CardContent className="p-6">
              <DashboardCardHeader
                eyebrow="Income Sources"
                title="Current Breakdown"
              />

              <div className="space-y-4">
                {incomeSources.map((item) => (
                  <DashboardListItem
                    key={item.id}
                    title={item.name}
                    subtitle={item.frequency}
                    value={formatCurrency(item.amount)}
                    className="border-none bg-slate-50 p-4"
                  />
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
                  eyebrow="Recent Transactions"
                  title="Latest Income Activity"
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
                {recentIncome.map((item) => (
                  <DashboardListItem
                    key={item.id}
                    title={item.title}
                    subtitle={formatEnumLabel(item.category)}
                    value={formatCurrency(item.amount)}
                    meta={formatDate(item.receivedAt)}
                    tone="positive"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <AddIncomeDialog
        open={isAddIncomeOpen}
        onOpenChange={setIsAddIncomeOpen}
        onCreateIncome={createIncome}
      />
    </>
  );
}
