import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  mockLoanItems,
  mockLoanPayoffBars,
  mockLoanSummary,
} from "@/lib/mock-data/loan";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercentage(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

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

  return categoryLabels[category] ?? category;
}

function formatLoanStatus(status: string) {
  const statusLabels: Record<string, string> = {
    ACTIVE: "Active",
    PAID_OFF: "Paid Off",
    OVERDUE: "Overdue",
  };

  return statusLabels[status] ?? status;
}

const loanSummaryCards = [
  {
    label: "Total Loan Balance",
    value: mockLoanSummary.totalLoanBalance,
    helper: "Outstanding debt balance",
  },
  {
    label: "Monthly Payment",
    value: mockLoanSummary.monthlyPaymentTotal,
    helper: "Required this month",
  },
  {
    label: "Paid Off",
    value: mockLoanSummary.totalPaidOff,
    helper: "Total repaid so far",
  },
  {
    label: "Debt Ratio",
    value: mockLoanSummary.debtToIncomeRatio,
    helper: "Based on current income",
    isPercentage: true,
  },
];

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
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Loan Overview
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Manage debt with more clarity
          </h1>

          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Keep track of outstanding balances, monthly obligations, and payoff
            progress so your debt stays visible and under control.
          </p>
        </div>

        <Button className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
          Add Loan
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {loanSummaryCards.map((card) => (
          <Card
            key={card.label}
            className="rounded-[28px] border-slate-200 bg-white shadow-none"
          >
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {card.isPercentage
                  ? formatPercentage(card.value)
                  : formatCurrency(card.value)}
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
                  Loan Payoff Progress
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Repayment Trend
                </h3>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                2026
              </div>
            </div>

            <div className="rounded-[28px] bg-slate-50 p-6">
              <div className="flex h-72 items-end gap-4">
                {mockLoanPayoffBars.map((bar) => (
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
