import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const expenseSummaryCards = [
  {
    label: "Total Expenses",
    value: "$3,460.00",
    helper: "This month",
  },
  {
    label: "Essential Spending",
    value: "$2,180.00",
    helper: "Needs & fixed costs",
  },
  {
    label: "Lifestyle Spending",
    value: "$880.00",
    helper: "Dining, shopping, fun",
  },
  {
    label: "Average Daily Spend",
    value: "$115.33",
    helper: "Based on current month",
  },
];

const categoryBreakdown = [
  {
    name: "Housing",
    amount: "$1,200.00",
    percentage: "35%",
  },
  {
    name: "Food & Dining",
    amount: "$640.00",
    percentage: "18%",
  },
  {
    name: "Transportation",
    amount: "$420.00",
    percentage: "12%",
  },
  {
    name: "Utilities",
    amount: "$310.00",
    percentage: "9%",
  },
  {
    name: "Entertainment",
    amount: "$290.00",
    percentage: "8%",
  },
  {
    name: "Shopping",
    amount: "$220.00",
    percentage: "6%",
  },
];

const recentExpenses = [
  {
    title: "Apartment Rent",
    category: "Housing",
    date: "Apr 02, 2026",
    amount: "$1,200.00",
  },
  {
    title: "Supermarket",
    category: "Food & Dining",
    date: "Apr 06, 2026",
    amount: "$135.00",
  },
  {
    title: "Gas Refill",
    category: "Transportation",
    date: "Apr 08, 2026",
    amount: "$48.00",
  },
  {
    title: "Netflix Subscription",
    category: "Entertainment",
    date: "Apr 10, 2026",
    amount: "$15.00",
  },
  {
    title: "Electric Bill",
    category: "Utilities",
    date: "Apr 12, 2026",
    amount: "$74.00",
  },
];

const monthlyExpenseBars = [
  { month: "Jan", value: "58%" },
  { month: "Feb", value: "66%" },
  { month: "Mar", value: "72%" },
  { month: "Apr", value: "64%" },
  { month: "May", value: "78%" },
  { month: "Jun", value: "70%" },
];

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
                {card.value}
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
                {monthlyExpenseBars.map((bar) => (
                  <div
                    key={bar.month}
                    className="flex flex-1 flex-col items-center gap-3"
                  >
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-2xl bg-emerald-500"
                        style={{ height: bar.value }}
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
              {categoryBreakdown.map((item) => (
                <div key={item.name} className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.percentage} of total expenses
                      </p>
                    </div>

                    <p className="text-lg font-bold text-slate-900">
                      {item.amount}
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
                  key={`${item.title}-${item.date}`}
                  className="flex flex-col gap-4 rounded-[28px] border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.category}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-base font-semibold text-slate-900">
                      {item.amount}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{item.date}</p>
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
