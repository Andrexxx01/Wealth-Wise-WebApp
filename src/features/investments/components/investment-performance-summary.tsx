"use client";

import Link from "next/link";

import SummaryCard from "@/components/dashboard/summary-card";
import { useCurrentUser } from "@/features/auth/components/current-user-provider";
import { useFinance } from "@/features/finance/components/finance-provider";
import { buildInvestmentPerformanceCards } from "@/lib/finance-summary-cards";

export default function InvestmentPerformanceSummary() {
  const { currentUser } = useCurrentUser();
  const {
    investmentPortfolioV2,
    isInvestmentPortfolioV2Loading,
    investmentPortfolioV2Error,
  } = useFinance();

  const summary = investmentPortfolioV2?.summary ?? null;
  const currencyMatches = summary?.displayCurrency === currentUser.currency;
  const cards = buildInvestmentPerformanceCards({
    summary,
    currency: currentUser.currency,
    isLoading: isInvestmentPortfolioV2Loading,
    error: investmentPortfolioV2Error,
  });

  let statusMessage = "All-time performance from recorded investment activity.";

  if (investmentPortfolioV2Error) {
    statusMessage = "Investment performance is currently unavailable.";
  } else if (isInvestmentPortfolioV2Loading) {
    statusMessage = "Loading investment performance…";
  } else if (summary === null || !currencyMatches) {
    statusMessage = "Waiting for investment values in your display currency.";
  } else if (summary.unvaluedAssets > 0) {
    statusMessage = `Partial valuation: ${summary.valuedAssets} of ${summary.totalAssets} assets valued. Gains and total return include available valuations.`;
  }

  return (
    <section aria-label="Investment performance" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Investment Performance
          </h2>
          <p
            role={investmentPortfolioV2Error ? "alert" : "status"}
            className="mt-1 text-sm text-slate-500"
          >
            {statusMessage}
          </p>
        </div>
        <Link
          href="/investments"
          className="font-semibold text-emerald-700 hover:underline"
        >
          View investments
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  );
}
