import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    title: "See the full picture",
    description:
      "Monitor income, expenses, investments, and loans together in one connected financial dashboard.",
  },
  {
    title: "Make better decisions",
    description:
      "Use clear summaries and visual reports to understand trends before they become problems.",
  },
  {
    title: "Stay focused on goals",
    description:
      "Keep your money habits aligned with savings targets, debt reduction, and long-term growth.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="order-2 lg:order-1">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Why WealthWise
          </span>

          <h2 className="mt-6 max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Financial clarity that feels simple and actionable
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            WealthWise is built to help you understand your money clearly, not
            just collect numbers. Every section is designed to turn financial
            data into practical insight.
          </p>

          <div className="mt-10 space-y-4">
            {benefits.map((benefit) => (
              <Card
                key={benefit.title}
                className="rounded-[24px] border-slate-200 bg-white shadow-none"
              >
                <CardContent className="flex gap-4 p-6">
                  <div className="mt-1 h-10 w-10 shrink-0 rounded-2xl bg-emerald-100" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="order-1 flex items-center justify-center lg:order-2">
          <div className="relative w-full max-w-140">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Monthly Overview
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    Financial Summary
                  </h3>
                </div>

                <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  +18.2%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-slate-100 p-5">
                  <p className="text-sm text-slate-500">Cash Flow</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    $4,740
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-100 p-5">
                  <p className="text-sm text-slate-500">Net Worth</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    $36,200
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl bg-slate-100 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    Spending Trend
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Last 6 months
                  </p>
                </div>

                <div className="flex h-40 items-end gap-3">
                  <div className="h-20 flex-1 rounded-t-2xl bg-emerald-200" />
                  <div className="h-28 flex-1 rounded-t-2xl bg-emerald-300" />
                  <div className="h-24 flex-1 rounded-t-2xl bg-emerald-200" />
                  <div className="h-36 flex-1 rounded-t-2xl bg-emerald-400" />
                  <div className="h-32 flex-1 rounded-t-2xl bg-emerald-300" />
                  <div className="h-40 flex-1 rounded-t-2xl bg-emerald-500" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:block">
              <p className="text-sm font-medium text-slate-500">Savings Rate</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">34%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
