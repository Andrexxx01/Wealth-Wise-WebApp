import ChartCard from "@/components/dashboard/chart-card";
import { GroupedBarChartMock } from "@/components/dashboard/bar-chart-mock";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/formatters";
import { mockAnalysisSummary } from "@/lib/mock-data/analysis";
import { mockExpenseItems, mockExpenseSummary } from "@/lib/mock-data/expense";
import { mockIncomeItems, mockIncomeSummary } from "@/lib/mock-data/income";
import { mockInvestmentSummary } from "@/lib/mock-data/investment";
import { mockLoanSummary } from "@/lib/mock-data/loan";
import { mockUserProfile } from "@/lib/mock-data/user";
import type { SummaryCardProps } from "@/types/ui";

function getFirstName(fullName: string) {
  return fullName.split(" ")[0] ?? fullName;
}

const monthlySurplus =
  mockIncomeSummary.totalIncome - mockExpenseSummary.totalExpenses;

const netWorth =
  monthlySurplus +
  mockInvestmentSummary.portfolioValue -
  mockLoanSummary.totalLoanBalance;

const savingsRate =
  mockIncomeSummary.totalIncome > 0
    ? (monthlySurplus / mockIncomeSummary.totalIncome) * 100
    : 0;

const summaryCards: SummaryCardProps[] = [
  {
    label: "Net Worth",
    value: formatCurrency(netWorth),
    helper: "Assets minus liabilities",
    tone: "positive",
  },
  {
    label: "Monthly Income",
    value: formatCurrency(mockIncomeSummary.totalIncome),
    helper: "Total income this month",
    tone: "positive",
  },
  {
    label: "Monthly Expenses",
    value: formatCurrency(mockExpenseSummary.totalExpenses),
    helper: "Total spending this month",
  },
  {
    label: "Portfolio Value",
    value: formatCurrency(mockInvestmentSummary.portfolioValue),
    helper: "Current investment value",
    tone: "positive",
  },
];

const recentIncome = mockIncomeItems.map((item) => ({
  id: item.id,
  title: item.title,
  type: "Income",
  amount: item.amount,
  date: item.receivedAt,
}));

const recentExpenses = mockExpenseItems.map((item) => ({
  id: item.id,
  title: item.title,
  type: "Expense",
  amount: -item.amount,
  date: item.spentAt,
}));

const recentActivity = [...recentIncome, ...recentExpenses]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5);

const cashFlowChartData = [
  { label: "Jan", primaryValue: 68, secondaryValue: 42 },
  { label: "Feb", primaryValue: 74, secondaryValue: 48 },
  { label: "Mar", primaryValue: 62, secondaryValue: 52 },
  { label: "Apr", primaryValue: 86, secondaryValue: 46 },
  { label: "May", primaryValue: 78, secondaryValue: 56 },
  { label: "Jun", primaryValue: 92, secondaryValue: 50 },
];

export default function DashboardPage() {
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
          <GroupedBarChartMock
            data={cashFlowChartData}
            primaryLabel="Income"
            secondaryLabel="Expense"
          />
        </ChartCard>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">
              Financial Health Score
            </p>

            <div className="mt-4 rounded-[28px] bg-linear-to-r from-emerald-500 to-green-600 p-6 text-white">
              <h3 className="text-5xl font-bold">
                {mockAnalysisSummary.healthScore.score}%
              </h3>

              <p className="mt-3 text-sm text-emerald-50">
                {mockAnalysisSummary.healthScore.label}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Monthly Surplus
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(monthlySurplus)}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Savings Rate
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatPercentage(savingsRate)}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Debt Balance
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(mockLoanSummary.totalLoanBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">
              Quick Financial Snapshot
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Current Position
            </h3>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Invested
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {formatCurrency(mockInvestmentSummary.totalInvested)}
                  </p>
                </div>

                <p className="text-sm font-semibold text-emerald-600">
                  +{formatCurrency(mockInvestmentSummary.netGain)}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Recurring Income
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {formatCurrency(mockIncomeSummary.recurringIncome)}
                  </p>
                </div>

                <p className="text-sm font-semibold text-slate-500">Monthly</p>
              </div>

              <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Essential Spending
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {formatCurrency(mockExpenseSummary.essentialSpending)}
                  </p>
                </div>

                <p className="text-sm font-semibold text-slate-500">Needs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500">
                Recent Activity
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Latest Financial Records
              </h3>
            </div>

            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex flex-col gap-4 rounded-[28px] border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {item.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">{item.type}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p
                      className={
                        item.amount >= 0
                          ? "text-base font-semibold text-emerald-600"
                          : "text-base font-semibold text-slate-900"
                      }
                    >
                      {item.amount >= 0 ? "+" : ""}
                      {formatCurrency(item.amount)}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(item.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
