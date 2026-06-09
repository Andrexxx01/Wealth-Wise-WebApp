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
import { INVESTMENT_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { useFinance } from "@/features/finance/components/finance-provider";
import { useFinanceSummary } from "@/features/finance/hooks/use-finance-summary";
import AddInvestmentDialog from "@/features/investments/components/add-investment-dialog";
import {
  buildInvestmentHoldings,
  buildPortfolioAllocation,
} from "@/lib/finance-calculations";
import { buildInvestmentPerformanceChartData } from "@/lib/finance-charts";
import { buildInvestmentSummaryCards } from "@/lib/finance-summary-cards";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

function formatInvestmentCategory(category: string) {
  const categoryOption = INVESTMENT_CATEGORY_OPTIONS.find(
    (option) => option.value === category,
  );

  return categoryOption?.label ?? category;
}

export default function InvestmentsPageClient() {
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);

  const { investmentItems, createInvestment } = useFinance();

  const { portfolioValue, totalInvested, netGain, investmentReturnRate } =
    useFinanceSummary();

  const investmentSummaryCards = buildInvestmentSummaryCards({
    portfolioValue,
    totalInvested,
    netGain,
    investmentReturnRate,
  });

  const investmentPerformanceChartData = buildInvestmentPerformanceChartData({
    investmentItems,
  });

  const portfolioAllocation = buildPortfolioAllocation({
    investmentItems,
    portfolioValue,
    limit: 5,
  });

  const holdings = buildInvestmentHoldings(investmentItems);

  return (
    <>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Investment Overview"
          title="Grow and monitor your portfolio"
          description="Track your asset allocation, portfolio value, and investment growth in one place so you can understand how your money is performing over time."
          action={
            <Button
              type="button"
              onClick={() => setIsAddInvestmentOpen(true)}
              className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
            >
              Add Investment
            </Button>
          }
        />

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {investmentSummaryCards.map((card) => (
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
            eyebrow="Portfolio Performance"
            title="Growth Over Time"
            badge="2026"
          >
            <BarChartMock data={investmentPerformanceChartData} />
          </ChartCard>

          <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
            <CardContent className="p-6">
              <DashboardCardHeader
                eyebrow="Portfolio Allocation"
                title="Asset Breakdown"
              />

              <div className="space-y-4">
                {portfolioAllocation.map((item) => (
                  <DashboardListItem
                    key={item.category}
                    title={item.name}
                    subtitle={`${item.percentage}% of portfolio`}
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
                  eyebrow="Current Holdings"
                  title="Portfolio Positions"
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
                {holdings.map((item) => {
                  const isPositive = item.gainPercentage >= 0;

                  return (
                    <DashboardListItem
                      key={item.id}
                      title={item.asset}
                      subtitle={formatInvestmentCategory(item.category)}
                      value={formatCurrency(item.currentValue)}
                      meta={`${isPositive ? "+" : ""}${formatPercentage(
                        item.gainPercentage,
                      )}`}
                      tone={isPositive ? "positive" : "danger"}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <AddInvestmentDialog
        open={isAddInvestmentOpen}
        onOpenChange={setIsAddInvestmentOpen}
        onCreateInvestment={createInvestment}
      />
    </>
  );
}
