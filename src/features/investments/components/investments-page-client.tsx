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

import { useFinance } from "@/features/finance/components/finance-provider";

import AddInvestmentV2Dialog from "@/features/investments/components/add-investment-v2-dialog";

import { buildInvestmentV2Allocation } from "@/features/investments/lib/investment-v2-allocation";

import { buildInvestmentV2ContributionChartData } from "@/lib/finance-charts";

import { formatCurrency, formatDate } from "@/lib/formatters";

function formatInvestmentTransactionType(
  type: "BUY" | "SELL" | "OPEN" | "CLOSE",
) {
  switch (type) {
    case "BUY":
      return "Buy";

    case "SELL":
      return "Sell";

    case "OPEN":
      return "Open";

    case "CLOSE":
      return "Close";
  }
}

function formatInvestmentTransactionAmount(
  amount: number,
  currencyCode: string,
) {
  if (currencyCode === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  if (currencyCode === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  return `${currencyCode} ${amount.toLocaleString()}`;
}

function formatInvestmentTransactionQuantity(quantity: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 18,
  }).format(quantity);
}

export default function InvestmentsPageClient() {
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);

  const {
    investmentPortfolioV2,
    isInvestmentPortfolioV2Loading,
    investmentPortfolioV2Error,

    investmentTransactionsV2,
    isInvestmentTransactionsV2Loading,
    investmentTransactionsV2Error,

    investmentContributionsV2,
    isInvestmentContributionsV2Loading,
    investmentContributionsV2Error,
  } = useFinance();

  // =====================================================
  // PORTFOLIO SUMMARY
  // =====================================================

  const portfolioSummary = investmentPortfolioV2?.summary ?? null;

  const hasPortfolioAssets = (portfolioSummary?.totalAssets ?? 0) > 0;

  const hasValuedAssets = (portfolioSummary?.valuedAssets ?? 0) > 0;

  const hasUnvaluedAssets = (portfolioSummary?.unvaluedAssets ?? 0) > 0;

  const isPortfolioSummaryReady =
    !isInvestmentPortfolioV2Loading &&
    !investmentPortfolioV2Error &&
    portfolioSummary !== null;

  const portfolioDisplayCurrency = portfolioSummary?.displayCurrency ?? "USD";

  // =====================================================
  // PORTFOLIO ALLOCATION
  // =====================================================

  const investmentAllocation = buildInvestmentV2Allocation(
    investmentPortfolioV2?.data ?? [],
  );

  // =====================================================
  // INVESTMENT CONTRIBUTION CHART
  // =====================================================

  const contributionExchangeRate =
    investmentPortfolioV2?.meta.exchangeRate.rate ?? null;

  const investmentContributionChartData =
    contributionExchangeRate !== null
      ? buildInvestmentV2ContributionChartData({
          contributions: investmentContributionsV2,

          displayCurrency: portfolioDisplayCurrency,

          usdToIdrRate: contributionExchangeRate,
        })
      : [];

  const hasInvestmentContributions = investmentContributionsV2.length > 0;

  const canShowInvestmentChart =
    !isInvestmentContributionsV2Loading &&
    !investmentContributionsV2Error &&
    contributionExchangeRate !== null &&
    hasInvestmentContributions;
  
  const recentInvestmentTransactions = investmentTransactionsV2.slice(0, 10);

  return (
    <>
      <div className="space-y-8">
        {/* =================================================
            HEADER
        ================================================= */}

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

        {/* =================================================
            PORTFOLIO SUMMARY
        ================================================= */}

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Portfolio Value"
            value={
              !isPortfolioSummaryReady
                ? "—"
                : hasPortfolioAssets && !hasValuedAssets
                  ? "—"
                  : formatCurrency(
                      portfolioSummary.totalMarketValue,

                      portfolioDisplayCurrency,
                    )
            }
            helper={
              isInvestmentPortfolioV2Loading
                ? "Loading portfolio valuation..."
                : investmentPortfolioV2Error
                  ? "Portfolio valuation is currently unavailable."
                  : !portfolioSummary
                    ? "Portfolio data is unavailable."
                    : portfolioSummary.totalAssets === 0
                      ? "No investment assets yet"
                      : hasUnvaluedAssets
                        ? `${portfolioSummary.valuedAssets} of ${portfolioSummary.totalAssets} assets valued — market value is partial`
                        : `${portfolioSummary.valuedAssets} of ${portfolioSummary.totalAssets} assets valued`
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
            helper="Remaining cost basis from recorded investment transactions"
          />

          <SummaryCard
            label="Unrealized Gain/Loss"
            value={
              !isPortfolioSummaryReady ||
              (hasPortfolioAssets && !hasValuedAssets)
                ? "—"
                : formatCurrency(
                    portfolioSummary.totalUnrealizedGainLoss,

                    portfolioDisplayCurrency,
                  )
            }
            helper={
              hasUnvaluedAssets
                ? "Calculated from assets with available market valuation only"
                : "Market value minus remaining cost basis"
            }
            tone={
              isPortfolioSummaryReady && hasValuedAssets
                ? portfolioSummary.totalUnrealizedGainLoss > 0
                  ? "positive"
                  : portfolioSummary.totalUnrealizedGainLoss < 0
                    ? "danger"
                    : "default"
                : "default"
            }
          />

          <SummaryCard
            label="Unrealized Return"
            value={
              !isPortfolioSummaryReady ||
              portfolioSummary.unrealizedReturnPercentage === null
                ? "—"
                : `${portfolioSummary.unrealizedReturnPercentage.toFixed(2)}%`
            }
            helper={
              hasUnvaluedAssets
                ? "Return based on assets with available market valuation only"
                : "Unrealized gain/loss relative to cost basis"
            }
            tone={
              isPortfolioSummaryReady &&
              portfolioSummary.unrealizedReturnPercentage !== null
                ? portfolioSummary.unrealizedReturnPercentage > 0
                  ? "positive"
                  : portfolioSummary.unrealizedReturnPercentage < 0
                    ? "danger"
                    : "default"
                : "default"
            }
          />
        </section>

        {/* =================================================
            CONTRIBUTIONS + ALLOCATION
        ================================================= */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <ChartCard
            eyebrow="Investment Activity"
            title="Investment Contributions"
            badge="Last 6 Months"
          >
            {isInvestmentContributionsV2Loading ? (
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">
                  Loading investment contributions...
                </p>
              </div>
            ) : investmentContributionsV2Error ? (
              <div className="rounded-[28px] border border-red-200 bg-red-50 p-6">
                <p className="text-sm text-red-700">
                  {investmentContributionsV2Error}
                </p>
              </div>
            ) : canShowInvestmentChart ? (
              <BarChartMock data={investmentContributionChartData} />
            ) : (
              <EmptyState
                title="No investment activity yet"
                description="Add investment purchases or deposits to see your contribution activity over the last six months."
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
                title="Portfolio Allocation"
              />

              {investmentAllocation.length > 0 ? (
                <div className="space-y-4">
                  {investmentAllocation.map((item) => (
                    <DashboardListItem
                      key={item.category}
                      title={item.name}
                      subtitle={`${item.percentage.toFixed(
                        2,
                      )}% of current portfolio`}
                      value={formatCurrency(
                        item.marketValue,
                        portfolioDisplayCurrency,
                      )}
                      className="border-none bg-slate-50 p-4"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No portfolio allocation yet"
                  description="Portfolio allocation will appear after your investment assets have an available market valuation."
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

        {/* =================================================
            RECENT TRANSACTIONS
        ================================================= */}

        <section>
          <Card>
            <CardContent className="space-y-5 p-6">
              <DashboardCardHeader
                eyebrow="Investment Activity"
                title="Recent Transactions"
              />

              {isInvestmentTransactionsV2Loading ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Loading investment transactions...
                  </p>
                </div>
              ) : null}

              {!isInvestmentTransactionsV2Loading &&
              investmentTransactionsV2Error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">
                    {investmentTransactionsV2Error}
                  </p>
                </div>
              ) : null}

              {!isInvestmentTransactionsV2Loading &&
              !investmentTransactionsV2Error &&
              recentInvestmentTransactions.length === 0 ? (
                <EmptyState
                  title="No investment transactions yet"
                  description="Your investment purchases, sales, deposits, and principal transactions will appear here."
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddInvestmentOpen(true)}
                    >
                      Add Investment
                    </Button>
                  }
                />
              ) : null}

              {!isInvestmentTransactionsV2Loading &&
              !investmentTransactionsV2Error &&
              recentInvestmentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentInvestmentTransactions.map((transaction) => {
                    const transactionType = formatInvestmentTransactionType(
                      transaction.type,
                    );

                    const assetTitle = transaction.assetSymbol
                      ? `${transaction.assetName} (${transaction.assetSymbol})`
                      : transaction.assetName;

                    const quantityText =
                      transaction.quantity !== null
                        ? `${formatInvestmentTransactionQuantity(
                            transaction.quantity,
                          )} ${transaction.assetSymbol ?? "units"}`
                        : null;

                    const feeText =
                      transaction.feeAmount > 0
                        ? `Fee ${formatInvestmentTransactionAmount(
                            transaction.feeAmount,
                            transaction.currencyCode,
                          )}`
                        : null;

                    const subtitleParts = [
                      transactionType,
                      quantityText,
                      formatDate(transaction.transactedAt),
                      feeText,
                    ].filter((value): value is string => Boolean(value));

                    return (
                      <DashboardListItem
                        key={transaction.id}
                        title={assetTitle}
                        subtitle={subtitleParts.join(" • ")}
                        value={formatInvestmentTransactionAmount(
                          transaction.grossAmount,
                          transaction.currencyCode,
                        )}
                        className="border-none bg-slate-50 p-4"
                      />
                    );
                  })}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* =================================================
          ADD INVESTMENT V2 DIALOG
      ================================================= */}

      <AddInvestmentV2Dialog
        open={isAddInvestmentOpen}
        onOpenChange={setIsAddInvestmentOpen}
      />
    </>
  );
}
