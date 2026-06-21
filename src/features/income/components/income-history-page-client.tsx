"use client";

import Link from "next/link";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import EmptyState from "@/components/dashboard/empty-state";
import SectionHeader from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditIncomeDialog from "@/features/income/components/edit-income-dialog";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { IncomeItem } from "@/types/income";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import { sortIncomeHistoryItems } from "@/lib/finance-history-sorters";
import {
  formatIncomeCategory,
  formatIncomeFrequency,
} from "@/lib/finance-labels";

export default function IncomeHistoryPageClient() {
  const {
    selectedRecord: selectedIncome,
    isEditDialogOpen: isEditIncomeOpen,
    openEditDialog: handleOpenEditIncome,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<IncomeItem>();

  const { incomeItems, updateIncome, deleteIncome } = useFinance();

  const sortedIncomeItems = sortIncomeHistoryItems(incomeItems);

  return (
    <>
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
                    subtitle={`${formatIncomeCategory(
                      item.category,
                    )} • ${formatIncomeFrequency(item.frequency)}`}
                    value={formatCurrency(item.amount)}
                    meta={formatDate(item.receivedAt)}
                    tone="positive"
                  >
                    <RecordActionButtons
                      className="mt-4"
                      onEdit={() => handleOpenEditIncome(item)}
                      onDelete={() => deleteIncome(item.id)}
                      deleteConfirmMessage="Are you sure you want to delete this income record?"
                    />
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

      <EditIncomeDialog
        open={isEditIncomeOpen}
        onOpenChange={handleEditDialogChange}
        income={selectedIncome}
        onUpdateIncome={updateIncome}
      />
    </>
  );
}
