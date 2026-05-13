import ChartCard from "@/components/dashboard/chart-card";
import { BarChartMock } from "@/components/dashboard/bar-chart-mock";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatCurrency,
  formatDate,
  formatEnumLabel,
  formatPercentage,
} from "@/lib/formatters";
import {
  mockLoanItems,
  mockLoanPayoffBars,
  mockLoanSummary,
} from "@/lib/mock-data/loan";

function formatLoanCategory(category: string) {
  const categoryLabels: Record<string, string> = {
    PERSONAL: "Personal Loan",
    CONSUMER: "Consumer Loan",
    VEHICLE: "Vehicle Loan",
    MORTGAGE: "Mortgage",
    STUDENT: "Student Loan",
    BUSINESS: "Business Loan",
    OTHER: "Other Loan",
  };

  return categoryLabels[category] ?? formatEnumLabel(category);
}

function formatLoanStatus(status: string) {
  const statusLabels: Record<string, string> = {
    ACTIVE: "Active",
    PAID_OFF: "Paid Off",
    OVERDUE: "Overdue",
  };

  return statusLabels[status] ?? formatEnumLabel(status);
}

const loanSummaryCards = [
  {
    label: "Total Loan Balance",
    value: formatCurrency(mockLoanSummary.totalLoanBalance),
    helper: "Outstanding debt balance",
  },
  {
    label: "Monthly Payment",
    value: formatCurrency(mockLoanSummary.monthlyPaymentTotal),
    helper: "Required this month",
  },
  {
    label: "Paid Off",
    value: formatCurrency(mockLoanSummary.totalPaidOff),
    helper: "Total repaid so far",
    tone: "positive" as const,
  },
  {
    label: "Debt Ratio",
    value: formatPercentage(mockLoanSummary.debtToIncomeRatio),
    helper: "Based on current income",
  },
];

const loanPayoffChartData = mockLoanPayoffBars.map((item) => ({
  label: item.month,
  value: item.value,
}));

const loanAccounts = mockLoanItems.map((item) => {
  const paidAmount = item.principalAmount - item.remainingBalance;
  const progress =
    item.principalAmount > 0 ? (paidAmount / item.principalAmount) * 100 : 0;

  return {
    id: item.id,
    title: item.title,
    category: formatLoanCategory(item.category),
    remainingBalance: item.remainingBalance,
    monthlyPayment: item.monthlyPayment,
    progress,
    status: formatLoanStatus(item.status),
  };
});

const upcomingPayments = [...mockLoanItems]
  .sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  })
  .slice(0, 4);

export default function LoansPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Loan Overview"
        title="Manage debt with more clarity"
        description="Keep track of outstanding balances, monthly obligations, and payoff progress so your debt stays visible and under control."
        action={
          <Button className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
            Add Loan
          </Button>
        }
      />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {loanSummaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            helper={card.helper}
            tone={card.tone}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ChartCard
          eyebrow="Loan Payoff Progress"
          title="Repayment Trend"
          badge="2026"
        >
          <BarChartMock data={loanPayoffChartData} />
        </ChartCard>

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Loan Accounts</p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Active Debt List
            </h3>

            <div className="mt-6 space-y-4">
              {loanAccounts.map((item) => (
                <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.category}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        {formatCurrency(item.remainingBalance)}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatCurrency(item.monthlyPayment)}/mo
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-500">Payoff progress</span>
                      <span className="font-semibold text-slate-900">
                        {formatPercentage(item.progress)}
                      </span>
                    </div>

                    <div className="h-3 rounded-full bg-slate-200">
                      <div
                        className="h-3 rounded-full bg-emerald-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-sm font-medium text-emerald-600">
                    {item.status}
                  </p>
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
                  Upcoming Payments
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Next Loan Obligations
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
              {upcomingPayments.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-[28px] border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {item.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.lenderName}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-base font-semibold text-slate-900">
                      {formatCurrency(item.monthlyPayment)}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Due {formatDate(item.dueDate)}
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
