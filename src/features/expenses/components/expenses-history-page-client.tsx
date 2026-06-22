"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditExpenseDialog from "@/features/expenses/components/edit-expense-dialog";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { ExpenseItem } from "@/types/expense";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import { sortExpenseHistoryItems } from "@/lib/finance-history-sorters";
import { formatExpenseCategory, formatExpenseType } from "@/lib/finance-labels";
import HistoryPageShell from "@/components/dashboard/history-page-shell";

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
      <HistoryPageShell
        eyebrow="Expense History"
        title="All expense records"
        description="Review every spending record you have added to WealthWise."
        backHref="/expenses"
        backLabel="Back to Expenses"
        isEmpty={sortedExpenseItems.length === 0}
        emptyTitle="No expense records yet"
        emptyDescription="Your full expense history will appear here after you add spending records."
        emptyActionHref="/expenses"
        emptyActionLabel="Add Expense"
      >
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
      </HistoryPageShell>

      <EditExpenseDialog
        open={isEditExpenseOpen}
        onOpenChange={handleEditDialogChange}
        expense={selectedExpense}
        onUpdateExpense={updateExpense}
      />
    </>
  );
}
