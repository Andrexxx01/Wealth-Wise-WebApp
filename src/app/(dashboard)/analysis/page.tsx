import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Card, CardContent } from "@/components/ui/card";
import { mockAnalysisSummary } from "@/lib/mock-data/analysis";
import type { DashboardListItemTone } from "@/types/ui";

function getInsightToneClass(tone: string) {
  if (tone === "positive") return "bg-emerald-500";
  if (tone === "warning") return "bg-amber-500";

  return "bg-slate-400";
}

function getInsightToneLabel(tone: string) {
  if (tone === "positive") return "Positive";
  if (tone === "warning") return "Warning";

  return "Neutral";
}

function getInsightListTone(tone: string): DashboardListItemTone {
  if (tone === "positive") return "positive";
  if (tone === "warning") return "warning";

  return "default";
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
              <DashboardListItem
                title="Current Assessment"
                value={healthScore.label}
                className="border-none bg-slate-50 p-4"
              />

              <DashboardListItem
                title="Biggest Strength"
                value="Strong Savings Rate"
                tone="positive"
                className="border-none bg-slate-50 p-4"
              />

              <DashboardListItem
                title="Main Watch Area"
                value="Lifestyle Spending"
                tone="warning"
                className="border-none bg-slate-50 p-4"
              />
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
                <DashboardListItem
                  key={item.title}
                  title={item.title}
                  value={item.value}
                  meta={item.helper}
                  className="border-none bg-slate-50 p-5"
                />
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
                <DashboardListItem
                  key={item.id}
                  title={item.title}
                  value={getInsightToneLabel(item.tone)}
                  tone={getInsightListTone(item.tone)}
                >
                  <div className="flex gap-4">
                    <div
                      className={`mt-2 h-3 w-3 shrink-0 rounded-full ${getInsightToneClass(
                        item.tone,
                      )}`}
                    />

                    <p className="text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </DashboardListItem>
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
                <DashboardListItem
                  key={item.id}
                  title={item.title}
                  className="border-none bg-slate-50 p-5"
                >
                  <p className="text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </DashboardListItem>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
