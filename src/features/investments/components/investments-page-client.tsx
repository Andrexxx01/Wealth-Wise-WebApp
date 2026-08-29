"use client";

import { useState } from "react";
import { BarChartMock } from "@/components/dashboard/bar-chart-mock";
import ChartCard from "@/components/dashboard/chart-card";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import EmptyState from "@/components/dashboard/empty-state";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { INVESTMENT_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { useFinance } from "@/features/finance/components/finance-provider";
import AddInvestmentDialog from "@/features/investments/components/add-investment-dialog";
import {
  buildInvestmentAllocation,
  buildInvestmentTransactions,
  calculateTotalInvested,
} from "@/lib/finance-calculations";
import { buildInvestmentContributionChartData } from "@/lib/finance-charts";
import { formatCurrency, formatDate } from "@/lib/formatters";
import Link from "next/link";
import { useConvertedFinanceItems } from "@/features/finance/hooks/use-converted-finance-items";

function formatInvestmentCategory(category: string) {
  const categoryOption = INVESTMENT_CATEGORY_OPTIONS.find(
    (option) => option.value === category,
  );

  return categoryOption?.label ?? category;
}

export default function InvestmentsPageClient() {
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);

  const {
    investmentItems,
    investmentPortfolioV2,
    isInvestmentPortfolioV2Loading,
    investmentPortfolioV2Error,
    createInvestment,
  } = useFinance();

  const {
    investmentItems: convertedInvestmentItems,
    displayCurrency,
    isCurrencyConversionReady,
  } = useConvertedFinanceItems();

  const hasInvestmentItems = investmentItems.length > 0;

  const totalInvested = calculateTotalInvested(convertedInvestmentItems);

  const portfolioSummary = investmentPortfolioV2?.summary ?? null;

  const isPortfolioSummaryReady =
    !isInvestmentPortfolioV2Loading &&
    !investmentPortfolioV2Error &&
    portfolioSummary !== null;

  const portfolioDisplayCurrency =
    portfolioSummary?.displayCurrency ?? displayCurrency;

  const unrealizedReturnPercentage =
    portfolioSummary?.unrealizedReturnPercentage ?? null;

  const investmentContributionChartData = buildInvestmentContributionChartData({
    investmentItems: convertedInvestmentItems,
  });

  const canShowInvestmentChart =
    hasInvestmentItems && isCurrencyConversionReady;

  const investmentAllocation = buildInvestmentAllocation({
    investmentItems: convertedInvestmentItems,
    totalInvested,
    limit: 5,
  });

  const investmentTransactions = buildInvestmentTransactions(investmentItems);

  return (
    <>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Investment Overview"
          title="Track your investment activity"
          description="Record your investment purchases, transaction fees, asset quantities, and contribution history in one place."
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
          <SummaryCard
            label="Portfolio Value"
            value={
              isPortfolioSummaryReady
                ? formatCurrency(
                    portfolioSummary.totalMarketValue,
                    portfolioDisplayCurrency,
                  )
                : "—"
            }
            helper={
              isInvestmentPortfolioV2Loading
                ? "Loading portfolio valuation..."
                : investmentPortfolioV2Error
                  ? "Portfolio valuation unavailable"
                  : portfolioSummary
                    ? `${portfolioSummary.valuedAssets} of ${portfolioSummary.totalAssets} assets valued`
                    : "No investment assets yet"
            }
          />

          <SummaryCard
            label="Cost Basis"
            value={
              isPortfolioSummaryReady
                ? formatCurrency(
                    portfolioSummary.totalCostBasis,
                    portfolioDisplayCurrency,
                  )
                : "—"
            }
            helper="Remaining cost basis of valued holdings"
          />

          <SummaryCard
            label="Unrealized Gain/Loss"
            value={
              isPortfolioSummaryReady
                ? formatCurrency(
                    portfolioSummary.totalUnrealizedGainLoss,
                    portfolioDisplayCurrency,
                  )
                : "—"
            }
            helper="Market value minus remaining cost basis"
            tone={
              portfolioSummary
                ? portfolioSummary.totalUnrealizedGainLoss >= 0
                  ? "positive"
                  : "danger"
                : undefined
            }
          />

          <SummaryCard
            label="Unrealized Return"
            value={
              isPortfolioSummaryReady && unrealizedReturnPercentage !== null
                ? `${unrealizedReturnPercentage.toFixed(2)}%`
                : "—"
            }
            helper="Unrealized gain/loss relative to cost basis"
            tone={
              unrealizedReturnPercentage !== null
                ? unrealizedReturnPercentage >= 0
                  ? "positive"
                  : "danger"
                : undefined
            }
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <ChartCard
            eyebrow="Investment Activity"
            title="Investment Contributions"
            badge="Last 6 Months"
          >
            {canShowInvestmentChart ? (
              <BarChartMock data={investmentContributionChartData} />
            ) : (
              <EmptyState
                title="No investment activity yet"
                description="Add investment transactions to see how much you invest each month."
                action={
                  <Button
                    type="button"
                    onClick={() => setIsAddInvestmentOpen(true)}
                    className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                  >
                    Add Investment
                  </Button>
                }
              />
            )}
          </ChartCard>

          <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
            <CardContent className="p-6">
              <DashboardCardHeader
                eyebrow="Investment Allocation"
                title="Contribution Breakdown"
              />

              {investmentAllocation.length > 0 ? (
                <div className="space-y-4">
                  {investmentAllocation.map((item) => (
                    <DashboardListItem
                      key={item.category}
                      title={item.name}
                      subtitle={`${item.percentage}% of total invested`}
                      value={
                        isCurrencyConversionReady
                          ? formatCurrency(item.amount, displayCurrency)
                          : "—"
                      }
                      className="border-none bg-slate-50 p-4"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No investment allocation yet"
                  description="Add investment transactions to see how your contributions are distributed across asset categories."
                  action={
                    <Button
                      type="button"
                      onClick={() => setIsAddInvestmentOpen(true)}
                      className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                    >
                      Add Investment
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
            <CardContent className="p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <DashboardCardHeader
                  eyebrow="Investment Activity"
                  title="Recent Transactions"
                  className="mb-0"
                />

                {investmentTransactions.length > 0 ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-2xl border-slate-300 bg-white px-5 font-semibold text-slate-900 hover:bg-slate-100"
                  >
                    <Link href="/investments/history">View All</Link>
                  </Button>
                ) : null}
              </div>

              {investmentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {investmentTransactions.map((item) => (
                    <DashboardListItem
                      key={item.id}
                      title={
                        item.symbol
                          ? `${item.asset} (${item.symbol})`
                          : item.asset
                      }
                      subtitle={formatInvestmentCategory(item.category)}
                      value={formatCurrency(item.investedAmount, item.currency)}
                      meta={[
                        item.quantity !== null
                          ? `${item.quantity} ${item.symbol ?? "units"}`
                          : "Quantity unavailable",

                        `Fee ${formatCurrency(item.feeAmount, item.currency)}`,

                        formatDate(item.investedAt),
                      ].join(" • ")}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No investment transactions yet"
                  description="Your recent investment transactions will appear here after you add your first investment."
                  action={
                    <Button
                      type="button"
                      onClick={() => setIsAddInvestmentOpen(true)}
                      className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                    >
                      Add Investment
                    </Button>
                  }
                />
              )}
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
