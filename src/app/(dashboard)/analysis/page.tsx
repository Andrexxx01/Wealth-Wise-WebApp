import { Card, CardContent } from "@/components/ui/card";

const healthMetrics = [
  {
    label: "Savings Rate",
    value: "34%",
    helper: "Healthy and consistent",
  },
  {
    label: "Debt-to-Income Ratio",
    value: "14.6%",
    helper: "Still in a safe zone",
  },
  {
    label: "Investment Allocation",
    value: "48%",
    helper: "Good growth exposure",
  },
  {
    label: "Expense Load",
    value: "42%",
    helper: "Below income threshold",
  },
];

const insights = [
  {
    title: "Strong savings behavior",
    description:
      "Your current savings rate is above a healthy baseline, which gives you room to grow investments and handle emergencies better.",
    tone: "positive",
  },
  {
    title: "Debt remains manageable",
    description:
      "Your debt-to-income ratio is still under control, which means your current loan commitments are not putting too much pressure on your cash flow.",
    tone: "positive",
  },
  {
    title: "Lifestyle spending should be watched",
    description:
      "Dining, shopping, and entertainment are rising faster than essential spending. Keep an eye on these categories before they become a pattern.",
    tone: "warning",
  },
  {
    title: "Portfolio growth is promising",
    description:
      "Your investments are growing steadily, but your portfolio is still concentrated in a few categories. More diversification may reduce risk.",
    tone: "neutral",
  },
];

const actionItems = [
  "Keep your savings rate above 30% for the next 3 months.",
  "Reduce lifestyle expenses by 8% to improve monthly surplus.",
  "Maintain on-time loan payments to keep debt pressure low.",
  "Review portfolio allocation and add more diversification.",
];

const monthlyReview = [
  {
    title: "Cash Flow Health",
    value: "Positive",
    helper: "Income remains higher than monthly spending",
  },
  {
    title: "Spending Discipline",
    value: "Moderate",
    helper: "Lifestyle categories increased this month",
  },
  {
    title: "Debt Pressure",
    value: "Low",
    helper: "Loan burden is still well-managed",
  },
  {
    title: "Investment Momentum",
    value: "Good",
    helper: "Portfolio continues to grow month by month",
  },
];

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-3">
        <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          Financial Analysis
        </span>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Understand your financial health more clearly
        </h1>

        <p className="max-w-3xl text-base leading-7 text-slate-600">
          WealthWise turns your income, expenses, investments, and loans into a
          clearer financial story so you can make smarter decisions with more
          confidence.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">
              Financial Health Score
            </p>

            <div className="mt-5 rounded-[28px] bg-linear-to-r from-emerald-500 to-green-600 p-8 text-white">
              <h2 className="text-6xl font-bold tracking-tight">82%</h2>
              <p className="mt-3 text-base text-emerald-50">
                Your financial condition looks strong overall this month.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Current Assessment
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  Excellent Progress
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Biggest Strength
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  Strong Savings Rate
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Main Watch Area
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  Lifestyle Spending
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {healthMetrics.map((metric) => (
            <Card
              key={metric.label}
              className="rounded-[28px] border-slate-200 bg-white shadow-none"
            >
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500">
                  {metric.label}
                </p>
                <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {metric.value}
                </h3>
                <p className="mt-3 text-sm text-slate-500">{metric.helper}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </section>

      <section>
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500">
                Monthly Review
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Key Financial Signals
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {monthlyReview.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] bg-slate-50 p-5"
                >
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>
                  <h4 className="mt-3 text-2xl font-bold text-slate-900">
                    {item.value}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {item.helper}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500">Insights</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                What your data is saying
              </h3>
            </div>

            <div className="space-y-4">
              {insights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-slate-200 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${
                        item.tone === "positive"
                          ? "bg-emerald-500"
                          : item.tone === "warning"
                            ? "bg-amber-500"
                            : "bg-slate-400"
                      }`}
                    />

                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500">
                Recommended Actions
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Next best steps
              </h3>
            </div>

            <div className="space-y-4">
              {actionItems.map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-[28px] bg-slate-50 p-5"
                >
                  <div className="mt-1 h-8 w-8 shrink-0 rounded-2xl bg-emerald-100" />
                  <p className="text-sm leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
