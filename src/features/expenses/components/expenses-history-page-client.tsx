"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
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
import HistoryControls from "@/components/dashboard/history-controls";
import HistoryDateRangeFilter from "@/components/dashboard/history-date-range-filter";

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
            ? "Try changing your search keyword, category filter, type filter, or date range."
            : "Your full expense history will appear here after you add spending records."
        }
        emptyActionHref="/expenses"
        emptyActionLabel="Add Expense"
        toolbar={
          <HistoryControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search expenses by title, category, amount, or date..."
            resultCount={filteredExpenseItems.length}
            totalCount={sortedExpenseItems.length}
            recordLabel="expense records"
            hasActiveFilter={hasActiveFilter}
            isFiltering={isFiltering}
            onResetFilters={resetFilters}
            onClearAll={() => {
              setSearchQuery("");
              resetFilters();
            }}
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

            <HistoryDateRangeFilter
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              onDateFromChange={(value) => setFilter("dateFrom", value)}
              onDateToChange={(value) => setFilter("dateTo", value)}
            />
          </HistoryControls>
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
