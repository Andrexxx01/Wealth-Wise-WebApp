import { GroupedBarChartMock } from "@/components/dashboard/bar-chart-mock";
import ChartCard from "@/components/dashboard/chart-card";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
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

const quickSnapshotItems = [
  {
    id: "total-invested",
    title: "Total Invested",
    subtitle: "Capital deployed",
    value: formatCurrency(mockInvestmentSummary.totalInvested),
    meta: `+${formatCurrency(mockInvestmentSummary.netGain)}`,
    tone: "positive" as const,
  },
  {
    id: "recurring-income",
    title: "Recurring Income",
    subtitle: "Salary & fixed sources",
    value: formatCurrency(mockIncomeSummary.recurringIncome),
    meta: "Monthly",
  },
  {
    id: "essential-spending",
    title: "Essential Spending",
    subtitle: "Needs & fixed costs",
    value: formatCurrency(mockExpenseSummary.essentialSpending),
    meta: "Needs",
  },
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
            <DashboardCardHeader
              eyebrow="Financial Health Score"
              title={`${mockAnalysisSummary.healthScore.score}%`}
              description={mockAnalysisSummary.healthScore.label}
            />

            <div className="rounded-[28px] bg-linear-to-r from-emerald-500 to-green-600 p-6 text-white">
              <h3 className="text-5xl font-bold">
                {mockAnalysisSummary.healthScore.score}%
              </h3>

              <p className="mt-3 text-sm text-emerald-50">
                {mockAnalysisSummary.healthScore.summary}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <DashboardListItem
                title="Monthly Surplus"
                subtitle="Income minus expenses"
                value={formatCurrency(monthlySurplus)}
                tone="positive"
                className="border-none bg-slate-50 p-4"
              />

              <DashboardListItem
                title="Savings Rate"
                subtitle="Current monthly ratio"
                value={formatPercentage(savingsRate)}
                className="border-none bg-slate-50 p-4"
              />

              <DashboardListItem
                title="Debt Balance"
                subtitle="Outstanding liabilities"
                value={formatCurrency(mockLoanSummary.totalLoanBalance)}
                className="border-none bg-slate-50 p-4"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Quick Financial Snapshot"
              title="Current Position"
            />

            <div className="space-y-4">
              {quickSnapshotItems.map((item) => (
                <DashboardListItem
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  value={item.value}
                  meta={item.meta}
                  tone={item.tone}
                  className="border-none bg-slate-50 p-4"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Recent Activity"
              title="Latest Financial Records"
            />

            <div className="space-y-4">
              {recentActivity.map((item) => (
                <DashboardListItem
                  key={`${item.type}-${item.id}`}
                  title={item.title}
                  subtitle={item.type}
                  value={`${item.amount >= 0 ? "+" : ""}${formatCurrency(
                    item.amount,
                  )}`}
                  meta={formatDate(item.date)}
                  tone={item.amount >= 0 ? "positive" : "default"}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
