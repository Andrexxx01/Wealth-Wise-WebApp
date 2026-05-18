import { BarChartMock } from "@/components/dashboard/bar-chart-mock";
import ChartCard from "@/components/dashboard/chart-card";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatCurrency,
  formatEnumLabel,
  formatPercentage,
} from "@/lib/formatters";
import {
  mockInvestmentItems,
  mockInvestmentPerformanceBars,
  mockInvestmentSummary,
  mockPortfolioAllocation,
} from "@/lib/mock-data/investment";

function formatInvestmentCategory(category: string) {
  const categoryLabels: Record<string, string> = {
    STOCK: "Stock",
    CRYPTO: "Crypto",
    MUTUAL_FUND: "Mutual Fund",
    BOND: "Bond",
    GOLD: "Gold",
    PROPERTY: "Property",
    CASH: "Cash",
    OTHER: "Other",
  };

  return categoryLabels[category] ?? formatEnumLabel(category);
}

const investmentSummaryCards = [
  {
    label: "Portfolio Value",
    value: formatCurrency(mockInvestmentSummary.portfolioValue),
    helper: "Current total value",
  },
  {
    label: "Total Invested",
    value: formatCurrency(mockInvestmentSummary.totalInvested),
    helper: "Total capital deployed",
  },
  {
    label: "Net Gain",
    value: formatCurrency(mockInvestmentSummary.netGain),
    helper: "Overall return",
    tone: "positive" as const,
  },
  {
    label: "Monthly Growth",
    value: formatPercentage(mockInvestmentSummary.monthlyGrowthRate),
    helper: "Compared to last month",
    tone: "positive" as const,
  },
];

const investmentPerformanceChartData = mockInvestmentPerformanceBars.map(
  (item) => ({
    label: item.month,
    value: item.value,
  }),
);

const holdings = mockInvestmentItems.map((item) => {
  const gain = item.currentValue - item.investedAmount;
  const gainPercentage =
    item.investedAmount > 0 ? (gain / item.investedAmount) * 100 : 0;

  return {
    id: item.id,
    asset: item.assetName,
    type: formatInvestmentCategory(item.category),
    currentValue: item.currentValue,
    gainPercentage,
  };
});

export default function InvestmentsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Investment Overview"
        title="Grow and monitor your portfolio"
        description="Track your asset allocation, portfolio value, and investment growth in one place so you can understand how your money is performing over time."
        action={
          <Button className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
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
              {mockPortfolioAllocation.map((item) => (
                <DashboardListItem
                  key={item.name}
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
                    subtitle={item.type}
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
  );
}
