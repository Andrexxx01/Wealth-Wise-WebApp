import { BarChartMock } from "@/components/dashboard/bar-chart-mock";
import ChartCard from "@/components/dashboard/chart-card";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  mockExpenseCategoryBreakdown,
  mockExpenseItems,
  mockExpenseSummary,
  mockMonthlyExpenseBars,
} from "@/lib/mock-data/expense";

function formatExpenseCategory(category: string) {
  const categoryLabels: Record<string, string> = {
    HOUSING: "Housing",
    FOOD: "Food & Dining",
    TRANSPORT: "Transportation",
    UTILITIES: "Utilities",
    HEALTH: "Health",
    EDUCATION: "Education",
    SHOPPING: "Shopping",
    ENTERTAINMENT: "Entertainment",
    SUBSCRIPTION: "Subscription",
    TRAVEL: "Travel",
    OTHER: "Other",
  };

  return categoryLabels[category] ?? category;
}

const expenseSummaryCards = [
  {
    label: "Total Expenses",
    value: mockExpenseSummary.totalExpenses,
    helper: "This month",
  },
  {
    label: "Essential Spending",
    value: mockExpenseSummary.essentialSpending,
    helper: "Needs & fixed costs",
  },
  {
    label: "Lifestyle Spending",
    value: mockExpenseSummary.lifestyleSpending,
    helper: "Dining, shopping, fun",
  },
  {
    label: "Average Daily Spend",
    value: mockExpenseSummary.averageDailySpend,
    helper: "Based on current month",
  },
];

const monthlyExpenseChartData = mockMonthlyExpenseBars.map((item) => ({
  label: item.month,
  value: item.value,
}));

const recentExpenses = [...mockExpenseItems]
  .sort((a, b) => new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime())
  .slice(0, 5);

export default function ExpensesPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Expense Overview"
        title="Keep your spending under control"
        description="Track daily expenses, understand where your money goes, and build a clearer picture of your financial habits over time."
        action={
          <Button className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
            Add Expense
          </Button>
        }
      />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {expenseSummaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={formatCurrency(card.value)}
            helper={card.helper}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ChartCard
          eyebrow="Monthly Expense Trend"
          title="Spending Over Time"
          badge="2026"
        >
          <BarChartMock data={monthlyExpenseChartData} />
        </ChartCard>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Category Breakdown"
              title="Top Spending Areas"
            />

            <div className="space-y-4">
              {mockExpenseCategoryBreakdown.map((item) => (
                <DashboardListItem
                  key={item.name}
                  title={item.name}
                  subtitle={`${item.percentage}% of total expenses`}
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
                title="Latest Expense Activity"
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
              {recentExpenses.map((item) => (
                <DashboardListItem
                  key={item.id}
                  title={item.title}
                  subtitle={formatExpenseCategory(item.category)}
                  value={formatCurrency(item.amount)}
                  meta={formatDate(item.spentAt)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
