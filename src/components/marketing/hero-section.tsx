import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
};

export default function HeroSection({
  onOpenLogin,
  onOpenRegister,
}: HeroSectionProps) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
      <div className="flex flex-col justify-center">
        <div className="mb-6 inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          Smart finance management for modern users
        </div>

        <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
          Take Control of{" "}
          <span className="text-emerald-600">Your Financial Future</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Manage income, expenses, investments, and loans in one clean
          dashboard. WealthWise helps you understand your money clearly and make
          better financial decisions.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button
            type="button"
            onClick={onOpenRegister}
            className="h-14 rounded-2xl bg-emerald-600 px-8 text-base font-semibold text-white hover:bg-emerald-700"
          >
            Get Started Free
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onOpenLogin}
            className="h-14 rounded-2xl border-slate-300 bg-white px-8 text-base font-semibold text-slate-900 hover:bg-slate-100"
          >
            Log In
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500">
          <span>Free to get started</span>
          <span>Clean modern dashboard</span>
          <span>Built for clarity</span>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-155 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Current Balance
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                $24,580.00
              </h2>
            </div>

            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              +12.5%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-slate-100 p-5">
              <p className="text-sm font-medium text-slate-500">Income</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">$8,200</p>
            </div>

            <div className="rounded-3xl bg-slate-100 p-5">
              <p className="text-sm font-medium text-slate-500">Expenses</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">$3,460</p>
            </div>

            <div className="rounded-3xl bg-slate-100 p-5">
              <p className="text-sm font-medium text-slate-500">Investments</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">$12,900</p>
            </div>

            <div className="rounded-3xl bg-slate-100 p-5">
              <p className="text-sm font-medium text-slate-500">Loans</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">$1,200</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-linear-to-r from-emerald-500 to-green-600 p-6 text-white">
            <p className="text-sm font-medium text-emerald-50">
              Financial Health Score
            </p>

            <div className="mt-3 flex items-end justify-between">
              <h3 className="text-4xl font-bold">82%</h3>
              <p className="text-sm text-emerald-50">Excellent progress</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
