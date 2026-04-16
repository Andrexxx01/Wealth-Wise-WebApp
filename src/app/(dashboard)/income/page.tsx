import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const incomeSummaryCards = [
  {
    label: "Total Income",
    value: "$8,200.00",
    helper: "This month",
  },
  {
    label: "Recurring Income",
    value: "$6,500.00",
    helper: "Salary & fixed sources",
  },
  {
    label: "Extra Income",
    value: "$1,700.00",
    helper: "Freelance & side projects",
  },
  {
    label: "Projected Annual",
    value: "$98,400.00",
    helper: "Estimated yearly income",
  },
];

const incomeSources = [
  {
    name: "Primary Salary",
    amount: "$5,500.00",
    frequency: "Monthly",
  },
  {
    name: "Freelance Design",
    amount: "$1,200.00",
    frequency: "Irregular",
  },
  {
    name: "Consulting",
    amount: "$800.00",
    frequency: "Monthly",
  },
  {
    name: "Affiliate Revenue",
    amount: "$700.00",
    frequency: "Irregular",
  },
];

const recentIncome = [
  {
    source: "Primary Salary",
    category: "Salary",
    date: "Apr 01, 2026",
    amount: "$5,500.00",
  },
  {
    source: "Freelance Website Project",
    category: "Freelance",
    date: "Apr 05, 2026",
    amount: "$900.00",
  },
  {
    source: "Consulting Session",
    category: "Consulting",
    date: "Apr 09, 2026",
    amount: "$500.00",
  },
  {
    source: "Affiliate Commission",
    category: "Passive Income",
    date: "Apr 12, 2026",
    amount: "$300.00",
  },
];

const monthlyIncomeBars = [
  { month: "Jan", value: "68%" },
  { month: "Feb", value: "74%" },
  { month: "Mar", value: "62%" },
  { month: "Apr", value: "86%" },
  { month: "May", value: "78%" },
  { month: "Jun", value: "92%" },
];

export default function IncomePage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Income Overview
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Track your income clearly
          </h1>

          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Monitor salary, freelance payments, consulting revenue, and other
            income sources in one place so your financial analysis stays
            accurate.
          </p>
        </div>

        <Button className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
          Add Income
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {incomeSummaryCards.map((card) => (
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
                  Monthly Income Trend
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Income Growth
                </h3>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                2026
              </div>
            </div>

            <div className="rounded-[28px] bg-slate-50 p-6">
              <div className="flex h-72 items-end gap-4">
                {monthlyIncomeBars.map((bar) => (
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
            <p className="text-sm font-medium text-slate-500">Income Sources</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Current Breakdown
            </h3>

            <div className="mt-6 space-y-4">
              {incomeSources.map((item) => (
                <div key={item.name} className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.frequency}
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
                  Latest Income Activity
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
              {recentIncome.map((item) => (
                <div
                  key={`${item.source}-${item.date}`}
                  className="flex flex-col gap-4 rounded-[28px] border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {item.source}
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
