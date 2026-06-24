"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySearchInput from "@/components/dashboard/history-search-input";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditExpenseDialog from "@/features/expenses/components/edit-expense-dialog";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import { sortExpenseHistoryItems } from "@/lib/finance-history-sorters";
import { formatExpenseCategory, formatExpenseType } from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { ExpenseItem } from "@/types/expense";
import { doesExpenseMatchSearch } from "@/lib/finance-history-search";
import useHistorySearch from "@/hooks/use-history-search";

export default function ExpensesHistoryPageClient() {
  const {
    selectedRecord: selectedExpense,
    isEditDialogOpen: isEditExpenseOpen,
    openEditDialog: handleOpenEditExpense,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<ExpenseItem>();

  const { expenseItems, updateExpense, deleteExpense } = useFinance();

  const sortedExpenseItems = sortExpenseHistoryItems(expenseItems);

  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredExpenseItems,
    hasSearchQuery,
  } = useHistorySearch(sortedExpenseItems, doesExpenseMatchSearch);

  return (
    <>
      <HistoryPageShell
        eyebrow="Expense History"
        title="All expense records"
        description="Review every spending record you have added to WealthWise."
        backHref="/expenses"
        backLabel="Back to Expenses"
        isEmpty={filteredExpenseItems.length === 0}
        emptyTitle={
          hasSearchQuery
            ? "No matching expense records"
            : "No expense records yet"
        }
        emptyDescription={
          hasSearchQuery
            ? "Try searching by title, category, type, amount, or spent date."
            : "Your full expense history will appear here after you add spending records."
        }
        emptyActionHref="/expenses"
        emptyActionLabel="Add Expense"
        toolbar={
          <HistorySearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search expenses by title, category, amount, or date..."
          />
        }
      >
        {filteredExpenseItems.map((item) => (
          <DashboardListItem
            key={item.id}
            title={item.title}
            subtitle={`${formatExpenseCategory(
              item.category,
            )} • ${formatExpenseType(item.type)}`}
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
