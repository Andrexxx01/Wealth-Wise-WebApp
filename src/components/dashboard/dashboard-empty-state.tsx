import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardEmptyState() {
  return (
    <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
      <CardContent className="flex flex-col items-center px-6 py-16 text-center">
        <div className="h-20 w-20 rounded-[28px] bg-emerald-100" />

        <h2 className="mt-8 text-3xl font-bold tracking-tight text-slate-900">
          Start building your financial overview
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Add your income, expenses, investments, and loans to unlock insights,
          charts, and a complete view of your financial health.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
            Add Income
          </Button>

          <Button
            variant="outline"
            className="h-12 rounded-2xl border-slate-300 bg-white px-6 font-semibold text-slate-900 hover:bg-slate-100"
          >
            Add Expenses
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
