"use client";

import Link from "next/link";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import EmptyState from "@/components/dashboard/empty-state";
import SectionHeader from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/features/finance/components/finance-provider";
import { sortRecentIncomeItems } from "@/lib/finance-calculations";
import { formatCurrency, formatDate, formatEnumLabel } from "@/lib/formatters";

export default function IncomeHistoryPageClient() {
  const { incomeItems, deleteIncome } = useFinance();

  const sortedIncomeItems = sortRecentIncomeItems(
    incomeItems,
    incomeItems.length,
  );

  function handleDeleteIncome(incomeId: string) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this income record?",
    );

    if (!shouldDelete) return;

    deleteIncome(incomeId);
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Income History"
        title="All income records"
        description="Review every income record you have added to WealthWise."
        action={
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-2xl border-slate-300 bg-white px-6 font-semibold text-slate-900 hover:bg-slate-100"
          >
            <Link href="/income">Back to Income</Link>
          </Button>
        }
      />

      <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
        <CardContent className="p-6">
          {sortedIncomeItems.length > 0 ? (
            <div className="space-y-4">
              {sortedIncomeItems.map((item) => (
                <DashboardListItem
                  key={item.id}
                  title={item.title}
                  subtitle={formatEnumLabel(item.category)}
                  value={formatCurrency(item.amount)}
                  meta={formatDate(item.receivedAt)}
                  tone="positive"
                >
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDeleteIncome(item.id)}
                      className="h-10 rounded-xl border-red-200 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </DashboardListItem>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No income records yet"
              description="Your full income history will appear here after you add income records."
              action={
                <Button
                  asChild
                  className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                >
                  <Link href="/income">Add Income</Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
