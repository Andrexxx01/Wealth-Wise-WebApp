import { Card, CardContent } from "@/components/ui/card";

const summaryCards = [
  { label: "Total Balance", value: "$24,580.00", helper: "+12.5% this month" },
  { label: "Income", value: "$8,200.00", helper: "Monthly income" },
  { label: "Expenses", value: "$3,460.00", helper: "Monthly spending" },
  { label: "Investments", value: "$12,900.00", helper: "Portfolio value" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-3">
        <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          Overview
        </span>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Welcome back, Andre
        </h1>

        <p className="max-w-2xl text-base leading-7 text-slate-600">
          Here&apos;s a quick view of your financial health, monthly activity,
          and current money position.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Monthly Cash Flow
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Income vs Expense
                </h3>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                This Year
              </div>
            </div>

            <div className="flex h-72 items-end gap-4 rounded-[28px] bg-slate-50 p-6">
              <div className="h-28 flex-1 rounded-t-2xl bg-emerald-200" />
              <div className="h-36 flex-1 rounded-t-2xl bg-emerald-300" />
              <div className="h-24 flex-1 rounded-t-2xl bg-emerald-200" />
              <div className="h-44 flex-1 rounded-t-2xl bg-emerald-400" />
              <div className="h-40 flex-1 rounded-t-2xl bg-emerald-300" />
              <div className="h-56 flex-1 rounded-t-2xl bg-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">
              Financial Health Score
            </p>

            <div className="mt-4 rounded-[28px] bg-linear-to-r from-emerald-500 to-green-600 p-6 text-white">
              <h3 className="text-5xl font-bold">82%</h3>
              <p className="mt-3 text-sm text-emerald-50">
                Excellent progress this month
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Savings Rate
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">34%</p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Debt Exposure
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">$1,200</p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Investment Growth
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">+9.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
