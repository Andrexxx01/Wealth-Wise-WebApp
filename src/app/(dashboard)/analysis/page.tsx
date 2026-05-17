import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Card, CardContent } from "@/components/ui/card";
import { mockAnalysisSummary } from "@/lib/mock-data/analysis";

function getInsightToneClass(tone: string) {
  if (tone === "positive") return "bg-emerald-500";
  if (tone === "warning") return "bg-amber-500";

  return "bg-slate-400";
}

export default function AnalysisPage() {
  const {
    healthScore,
    healthMetrics,
    monthlyReview,
    insights,
    recommendedActions,
  } = mockAnalysisSummary;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Financial Analysis"
        title="Understand your financial health more clearly"
        description="WealthWise turns your income, expenses, investments, and loans into a clearer financial story so you can make smarter decisions with more confidence."
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Financial Health Score"
              title={`${healthScore.score}%`}
              description={healthScore.summary}
            />

            <div className="rounded-[28px] bg-linear-to-r from-emerald-500 to-green-600 p-8 text-white">
              <h2 className="text-6xl font-bold tracking-tight">
                {healthScore.score}%
              </h2>

              <p className="mt-3 text-base text-emerald-50">
                {healthScore.summary}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Current Assessment
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {healthScore.label}
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
            <SummaryCard
              key={metric.label}
              label={metric.label}
              value={String(metric.value)}
              helper={metric.helper}
            />
          ))}
        </section>
      </section>

      <section>
        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <DashboardCardHeader
              eyebrow="Monthly Review"
              title="Key Financial Signals"
            />

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
            <DashboardCardHeader
              eyebrow="Insights"
              title="What your data is saying"
            />

            <div className="space-y-4">
              {insights.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[28px] border border-slate-200 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${getInsightToneClass(
                        item.tone,
                      )}`}
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
            <DashboardCardHeader
              eyebrow="Recommended Actions"
              title="Next best steps"
            />

            <div className="space-y-4">
              {recommendedActions.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-[28px] bg-slate-50 p-5"
                >
                  <div className="mt-1 h-8 w-8 shrink-0 rounded-2xl bg-emerald-100" />

                  <div>
                    <h4 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h4>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {item.description}
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
