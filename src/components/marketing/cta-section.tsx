import { Button } from "@/components/ui/button";

type CtaSectionProps = {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
};

export default function CtaSection({
  onOpenRegister,
  onOpenLogin,
}: CtaSectionProps) {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[36px] bg-linear-to-r from-emerald-600 to-green-700 px-6 py-14 text-white shadow-[0_20px_60px_rgba(5,150,105,0.25)] sm:px-10 lg:px-14">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
              Start today
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Take control of your financial future with WealthWise
            </h2>

            <p className="mt-5 text-lg leading-8 text-emerald-50">
              Build better money habits, track everything in one place, and make
              smarter decisions with clear financial insights.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                type="button"
                onClick={onOpenRegister}
                className="h-14 rounded-2xl bg-white px-8 text-base font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Get Started Free
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onOpenLogin}
                className="h-14 rounded-2xl border-white/30 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
