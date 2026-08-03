"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Crown, Sparkles } from "lucide-react";
import Footer from "@/components/marketing/footer";
import MarketingNavbar from "@/components/marketing/navbar";
import { Button } from "@/components/ui/button";
import type { UserPlan } from "@/types/user-subscription";

type PricingPageClientProps = {
  isAuthenticated: boolean;
  currentPlan: UserPlan | null;
};

type PricingFeatureProps = {
  children: ReactNode;
  tone?: "light" | "dark";
};

function PricingFeature({ children, tone = "light" }: PricingFeatureProps) {
  const isDark = tone === "dark";

  return (
    <li className="flex items-start gap-3">
      <span
        className={
          isDark
            ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15"
            : "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100"
        }
      >
        <Check
          className={
            isDark
              ? "h-3.5 w-3.5 text-emerald-400"
              : "h-3.5 w-3.5 text-emerald-700"
          }
        />
      </span>

      <span
        className={
          isDark
            ? "text-sm leading-6 text-slate-300"
            : "text-sm leading-6 text-slate-600"
        }
      >
        {children}
      </span>
    </li>
  );
}

export default function PricingPageClient({
  isAuthenticated,
  currentPlan,
}: PricingPageClientProps) {
  const isFreeUser = currentPlan === "FREE";
  const isProUser = currentPlan === "PRO";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <MarketingNavbar isAuthenticated={isAuthenticated} />

      <main className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <section className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
              <Sparkles className="h-4 w-4" />
              Simple, transparent pricing
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Choose the plan that fits your financial journey
            </h1>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              Start for free and upgrade when you need unlimited finance records
              and advanced WealthWise features.
            </p>
          </section>

          <section className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <article className="flex flex-col rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                    Free
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-slate-950">
                    Build healthy habits
                  </h2>
                </div>

                {isFreeUser && (
                  <span className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    Current Plan
                  </span>
                )}
              </div>

              <div className="mt-8 flex items-end gap-2">
                <span className="text-5xl font-black tracking-tight text-slate-950">
                  $0
                </span>

                <span className="pb-1 text-sm font-semibold text-slate-500">
                  forever
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                Ideal for getting started with personal finance tracking.
              </p>

              <ul className="mt-8 space-y-4">
                <PricingFeature>Up to 50 income records</PricingFeature>

                <PricingFeature>Up to 50 expense records</PricingFeature>

                <PricingFeature>Up to 50 investment records</PricingFeature>

                <PricingFeature>Up to 50 loan records</PricingFeature>

                <PricingFeature>
                  Dashboard and financial summaries
                </PricingFeature>

                <PricingFeature>
                  Secure cloud storage with Neon PostgreSQL
                </PricingFeature>
              </ul>

              <div className="mt-auto pt-10">
                {isAuthenticated ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 w-full rounded-2xl border-slate-300 font-bold"
                  >
                    <Link href="/dashboard">
                      {isFreeUser ? "Continue with Free" : "Go to Dashboard"}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 w-full rounded-2xl border-slate-300 font-bold"
                  >
                    <Link href="/register">Get Started Free</Link>
                  </Button>
                )}
              </div>
            </article>

            <article className="relative flex flex-col overflow-hidden rounded-[32px] border-2 border-emerald-500 bg-slate-950 p-7 shadow-xl sm:p-8">
              <div className="absolute right-0 top-0 rounded-bl-3xl bg-emerald-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-white">
                Recommended
              </div>

              <div className="pr-28">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-400" />

                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-400">
                    Pro
                  </p>
                </div>

                <h2 className="mt-3 text-3xl font-black text-white">
                  Unlock unlimited tracking
                </h2>
              </div>

              {isProUser && (
                <div className="mt-5">
                  <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="mt-8 flex items-end gap-2">
                <span className="text-5xl font-black tracking-tight text-white">
                  $9
                </span>

                <span className="pb-1 text-sm font-semibold text-slate-400">
                  per month
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                Designed for users who need unrestricted financial history and
                advanced insights.
              </p>

              <ul className="mt-8 space-y-4">
                <PricingFeature tone="dark">
                  Unlimited income records
                </PricingFeature>

                <PricingFeature tone="dark">
                  Unlimited expense records
                </PricingFeature>

                <PricingFeature tone="dark">
                  Unlimited investment records
                </PricingFeature>

                <PricingFeature tone="dark">
                  Unlimited loan records
                </PricingFeature>

                <PricingFeature tone="dark">
                  Everything included in the Free plan
                </PricingFeature>

                <PricingFeature tone="dark">
                  Future advanced reports and financial insights
                </PricingFeature>
              </ul>

              <div className="mt-auto pt-10">
                {isProUser ? (
                  <Button
                    asChild
                    className="h-12 w-full rounded-2xl bg-emerald-500 font-bold text-white hover:bg-emerald-600"
                  >
                    <Link href="/dashboard">Continue with Pro</Link>
                  </Button>
                ) : isAuthenticated ? (
                  <Button
                    type="button"
                    disabled
                    className="h-12 w-full rounded-2xl bg-emerald-500 font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Upgrade Coming Soon
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="h-12 w-full rounded-2xl bg-emerald-500 font-bold text-white hover:bg-emerald-600"
                  >
                    <Link href="/register">Create an Account</Link>
                  </Button>
                )}

                {!isProUser && (
                  <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                    Secure subscription billing will be connected through
                    Stripe.
                  </p>
                )}
              </div>
            </article>
          </section>

          <section className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 text-center">
            <p className="text-sm leading-6 text-slate-600">
              Record limits apply separately to income, expenses, investments,
              and loans.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
