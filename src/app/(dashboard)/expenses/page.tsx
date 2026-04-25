import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  mockExpenseCategoryBreakdown,
  mockExpenseItems,
  mockExpenseSummary,
  mockMonthlyExpenseBars,
} from "@/lib/mock-data/expense";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

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

const recentExpenses = [...mockExpenseItems]
  .sort((a, b) => new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime())
  .slice(0, 5);

export default function ExpensesPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Expense Overview
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Keep your spending under control
          </h1>

          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Track daily expenses, understand where your money goes, and build a
            clearer picture of your financial habits over time.
          </p>
        </div>

        <Button className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
          Add Expense
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {expenseSummaryCards.map((card) => (
          <Card
            key={card.label}
            className="rounded-[28px] border-slate-200 bg-white shadow-none"
          >
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {formatCurrency(card.value)}
              </h2>

              <p className="mt-3 text-sm text-slate-500">{card.helper}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Monthly Expense Trend
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Spending Over Time
                </h3>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                2026
              </div>
            </div>

            <div className="rounded-[28px] bg-slate-50 p-6">
              <div className="flex h-72 items-end gap-4">
                {mockMonthlyExpenseBars.map((bar) => (
                  <div
                    key={bar.month}
                    className="flex flex-1 flex-col items-center gap-3"
                  >
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-2xl bg-emerald-500"
                        style={{ height: `${bar.value}%` }}
                      />
                    </div>

                    <span className="text-sm font-medium text-slate-500">
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">
              Category Breakdown
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Top Spending Areas
            </h3>

            <div className="mt-6 space-y-4">
              {mockExpenseCategoryBreakdown.map((item) => (
                <div key={item.name} className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.percentage}% of total expenses
                      </p>
                    </div>

                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Recent Transactions
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Latest Expense Activity
                </h3>
              </div>

              <Button
                variant="outline"
                className="h-11 rounded-2xl border-slate-300 bg-white px-5 font-semibold text-slate-900 hover:bg-slate-100"
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentExpenses.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-[28px] border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {item.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatExpenseCategory(item.category)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-base font-semibold text-slate-900">
                      {formatCurrency(item.amount)}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(item.spentAt)}
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
