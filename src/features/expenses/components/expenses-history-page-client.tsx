"use client";

import Link from "next/link";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import EmptyState from "@/components/dashboard/empty-state";
import SectionHeader from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditExpenseDialog from "@/features/expenses/components/edit-expense-dialog";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { ExpenseItem } from "@/types/expense";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import { sortExpenseHistoryItems } from "@/lib/finance-history-sorters";
import { formatExpenseCategory, formatExpenseType } from "@/lib/finance-labels";

export default function ExpensesHistoryPageClient() {
  const {
    selectedRecord: selectedExpense,
    isEditDialogOpen: isEditExpenseOpen,
    openEditDialog: handleOpenEditExpense,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<ExpenseItem>();

  const { expenseItems, updateExpense, deleteExpense } = useFinance();

  const sortedExpenseItems = sortExpenseHistoryItems(expenseItems);

  return (
    <>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Expense History"
          title="All expense records"
          description="Review every spending record you have added to WealthWise."
          action={
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-2xl border-slate-300 bg-white px-6 font-semibold text-slate-900 hover:bg-slate-100"
            >
              <Link href="/expenses">Back to Expenses</Link>
            </Button>
          }
        />

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            {sortedExpenseItems.length > 0 ? (
              <div className="space-y-4">
                {sortedExpenseItems.map((item) => (
                  <DashboardListItem
                    key={item.id}
                    title={item.title}
                    subtitle={`${formatExpenseCategory(item.category)} • ${formatExpenseType(
                      item.type,
                    )}`}
                    value={formatCurrency(item.amount)}
                    meta={formatDate(item.spentAt)}
                  >
                    <RecordActionButtons
                      className="mt-4"
                      onEdit={() => handleOpenEditExpense(item)}
                      onDelete={() => deleteExpense(item.id)}
                      deleteConfirmMessage="Are you sure you want to delete this expense record?"
                    />
                  </DashboardListItem>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No expense records yet"
                description="Your full expense history will appear here after you add spending records."
                action={
                  <Button
                    asChild
                    className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                  >
                    <Link href="/expenses">Add Expense</Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      <EditExpenseDialog
        open={isEditExpenseOpen}
        onOpenChange={handleEditDialogChange}
        expense={selectedExpense}
        onUpdateExpense={updateExpense}
      />
    </>
  );
}
