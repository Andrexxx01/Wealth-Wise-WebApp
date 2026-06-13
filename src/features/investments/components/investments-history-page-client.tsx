"use client";

import Link from "next/link";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import EmptyState from "@/components/dashboard/empty-state";
import SectionHeader from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { INVESTMENT_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { useFinance } from "@/features/finance/components/finance-provider";
import { formatCurrency, formatDate } from "@/lib/formatters";

function formatInvestmentCategory(category: string) {
  const categoryOption = INVESTMENT_CATEGORY_OPTIONS.find(
    (option) => option.value === category,
  );

  return categoryOption?.label ?? category;
}

export default function InvestmentsHistoryPageClient() {
  const { investmentItems, deleteInvestment } = useFinance();

  const sortedInvestmentItems = [...investmentItems].sort(
    (currentItem, nextItem) =>
      new Date(nextItem.investedAt).getTime() -
      new Date(currentItem.investedAt).getTime(),
  );

  function handleDeleteInvestment(investmentId: string) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this investment record?",
    );

    if (!shouldDelete) return;

    deleteInvestment(investmentId);
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Investment History"
        title="All investment records"
        description="Review every investment position you have added to WealthWise."
        action={
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-2xl border-slate-300 bg-white px-6 font-semibold text-slate-900 hover:bg-slate-100"
          >
            <Link href="/investments">Back to Investments</Link>
          </Button>
        }
      />

      <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
        <CardContent className="p-6">
          {sortedInvestmentItems.length > 0 ? (
            <div className="space-y-4">
              {sortedInvestmentItems.map((item) => {
                const gainAmount = item.currentValue - item.investedAmount;
                const isPositive = gainAmount >= 0;

                return (
                  <DashboardListItem
                    key={item.id}
                    title={item.assetName}
                    subtitle={formatInvestmentCategory(item.category)}
                    value={formatCurrency(item.currentValue)}
                    meta={`Invested ${formatCurrency(
                      item.investedAmount,
                    )} • ${formatDate(item.investedAt)}`}
                    tone={isPositive ? "positive" : "danger"}
                  >
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDeleteInvestment(item.id)}
                        className="h-10 rounded-xl border-red-200 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </DashboardListItem>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No investment records yet"
              description="Your full investment history will appear here after you add portfolio assets."
              action={
                <Button
                  asChild
                  className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                >
                  <Link href="/investments">Add Investment</Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
