import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const investmentSummaryCards = [
  {
    label: "Portfolio Value",
    value: "$12,900.00",
    helper: "Current total value",
  },
  {
    label: "Total Invested",
    value: "$11,200.00",
    helper: "Total capital deployed",
  },
  {
    label: "Net Gain",
    value: "+$1,700.00",
    helper: "+15.18% overall return",
  },
  {
    label: "Monthly Growth",
    value: "+4.8%",
    helper: "Compared to last month",
  },
];

const portfolioAllocation = [
  {
    name: "Stocks",
    amount: "$6,200.00",
    percentage: "48%",
  },
  {
    name: "Crypto",
    amount: "$2,300.00",
    percentage: "18%",
  },
  {
    name: "Mutual Funds",
    amount: "$2,100.00",
    percentage: "16%",
  },
  {
    name: "Bonds",
    amount: "$1,400.00",
    percentage: "11%",
  },
  {
    name: "Cash Reserve",
    amount: "$900.00",
    percentage: "7%",
  },
];

const holdings = [
  {
    asset: "Apple Inc.",
    type: "Stock",
    currentValue: "$3,100.00",
    change: "+8.2%",
  },
  {
    asset: "Bitcoin",
    type: "Crypto",
    currentValue: "$1,650.00",
    change: "+12.4%",
  },
  {
    asset: "S&P 500 Index Fund",
    type: "Fund",
    currentValue: "$2,100.00",
    change: "+5.6%",
  },
  {
    asset: "Government Bonds",
    type: "Bond",
    currentValue: "$1,400.00",
    change: "+2.1%",
  },
];

const performanceBars = [
  { month: "Jan", value: "54%" },
  { month: "Feb", value: "62%" },
  { month: "Mar", value: "58%" },
  { month: "Apr", value: "74%" },
  { month: "May", value: "80%" },
  { month: "Jun", value: "88%" },
];

export default function InvestmentsPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Investment Overview
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Grow and monitor your portfolio
          </h1>

          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Track your asset allocation, portfolio value, and investment growth
            in one place so you can understand how your money is performing over
            time.
          </p>
        </div>

        <Button className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
          Add Investment
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {investmentSummaryCards.map((card) => (
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
                  Portfolio Performance
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Growth Over Time
                </h3>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                2026
              </div>
            </div>

            <div className="rounded-[28px] bg-slate-50 p-6">
              <div className="flex h-72 items-end gap-4">
                {performanceBars.map((bar) => (
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
              Portfolio Allocation
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Asset Breakdown
            </h3>

            <div className="mt-6 space-y-4">
              {portfolioAllocation.map((item) => (
                <div key={item.name} className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.percentage} of portfolio
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
                  Current Holdings
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Portfolio Positions
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
              {holdings.map((item) => (
                <div
                  key={item.asset}
                  className="flex flex-col gap-4 rounded-[28px] border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {item.asset}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{item.type}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-base font-semibold text-slate-900">
                      {item.currentValue}
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-600">
                      {item.change}
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
