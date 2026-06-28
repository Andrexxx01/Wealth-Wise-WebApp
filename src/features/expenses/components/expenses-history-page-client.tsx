"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySearchInput from "@/components/dashboard/history-search-input";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditExpenseDialog from "@/features/expenses/components/edit-expense-dialog";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import useHistoryFilters from "@/hooks/use-history-filters";
import useHistorySearch from "@/hooks/use-history-search";
import { doesExpenseMatchSearch } from "@/lib/finance-history-search";
import { sortExpenseHistoryItems } from "@/lib/finance-history-sorters";
import { formatExpenseCategory, formatExpenseType } from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { ExpenseItem } from "@/types/expense";
import {
  doesExpensePassFilters,
  expenseCategoryFilterOptions,
  expenseInitialFilters,
  expenseTypeFilterOptions,
} from "@/lib/finance-history-filters";
import HistoryFilterPanel from "@/components/dashboard/history-filter-panel";
import HistoryClearAllButton from "@/components/dashboard/history-clear-all-button";

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
    filteredItems: searchMatchedExpenseItems,
    hasSearchQuery,
  } = useHistorySearch(sortedExpenseItems, doesExpenseMatchSearch);

  const {
    filters,
    setFilter,
    resetFilters,
    filteredItems: filteredExpenseItems,
    hasActiveFilter,
  } = useHistoryFilters(
    searchMatchedExpenseItems,
    expenseInitialFilters,
    doesExpensePassFilters,
  );

  const isFiltering = hasSearchQuery || hasActiveFilter;

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
          isFiltering ? "No matching expense records" : "No expense records yet"
        }
        emptyDescription={
          isFiltering
            ? "Try changing your search keyword, category filter, or type filter."
            : "Your full expense history will appear here after you add spending records."
        }
        emptyActionHref="/expenses"
        emptyActionLabel="Add Expense"
        toolbar={
          <div className="space-y-4">
            <HistorySearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search expenses by title, category, amount, or date..."
              resultCount={filteredExpenseItems.length}
              totalCount={sortedExpenseItems.length}
              recordLabel="expense records"
            />

            <HistoryFilterPanel
              hasActiveFilter={hasActiveFilter}
              onResetFilters={resetFilters}
            >
              <HistoryFilterSelect
                label="Category"
                value={filters.category}
                onChange={(value) => setFilter("category", value)}
                options={expenseCategoryFilterOptions}
              />

              <HistoryFilterSelect
                label="Type"
                value={filters.type}
                onChange={(value) => setFilter("type", value)}
                options={expenseTypeFilterOptions}
              />
            </HistoryFilterPanel>

            <HistoryClearAllButton
              isVisible={isFiltering}
              onClearAll={() => {
                setSearchQuery("");
                resetFilters();
              }}
            />
          </div>
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
