"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import DeleteRecordButton from "@/components/dashboard/delete-record-button";
import EmptyState from "@/components/dashboard/empty-state";
import SectionHeader from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EXPENSE_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditExpenseDialog from "@/features/expenses/components/edit-expense-dialog";
import { sortRecentExpenseItems } from "@/lib/finance-calculations";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { ExpenseItem } from "@/types/expense";

function formatExpenseCategory(category: string) {
  const categoryOption = EXPENSE_CATEGORY_OPTIONS.find(
    (option) => option.value === category,
  );

  return categoryOption?.label ?? category;
}

export default function ExpensesHistoryPageClient() {
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(
    null,
  );
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);

  const { expenseItems, updateExpense, deleteExpense } = useFinance();

  const sortedExpenseItems = sortRecentExpenseItems(
    expenseItems,
    expenseItems.length,
  );

  function handleOpenEditExpense(expense: ExpenseItem) {
    setSelectedExpense(expense);
    setIsEditExpenseOpen(true);
  }

  function handleEditDialogChange(open: boolean) {
    setIsEditExpenseOpen(open);

    if (!open) {
      setSelectedExpense(null);
    }
  }

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
                    subtitle={formatExpenseCategory(item.category)}
                    value={formatCurrency(item.amount)}
                    meta={formatDate(item.spentAt)}
                  >
                    <div className="mt-4 flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOpenEditExpense(item)}
                        className="h-10 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                      >
                        Edit
                      </Button>

                      <DeleteRecordButton
                        confirmMessage="Are you sure you want to delete this expense record?"
                        onConfirmDelete={() => deleteExpense(item.id)}
                      />
                    </div>
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
