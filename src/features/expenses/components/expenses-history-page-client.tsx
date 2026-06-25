"use client";

import { useMemo, useState } from "react";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySearchInput from "@/components/dashboard/history-search-input";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import {
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_TYPE_OPTIONS,
} from "@/constants/finance-options";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditExpenseDialog from "@/features/expenses/components/edit-expense-dialog";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import useHistorySearch from "@/hooks/use-history-search";
import { doesExpenseMatchSearch } from "@/lib/finance-history-search";
import { sortExpenseHistoryItems } from "@/lib/finance-history-sorters";
import { formatExpenseCategory, formatExpenseType } from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { ExpenseItem } from "@/types/expense";

const ALL_FILTER_VALUE = "ALL";

const expenseCategoryFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Categories" },
  ...EXPENSE_CATEGORY_OPTIONS,
] as const;

const expenseTypeFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Types" },
  ...EXPENSE_TYPE_OPTIONS,
] as const;

export default function ExpensesHistoryPageClient() {
  const [categoryFilter, setCategoryFilter] = useState(ALL_FILTER_VALUE);
  const [typeFilter, setTypeFilter] = useState(ALL_FILTER_VALUE);

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

  const filteredExpenseItems = useMemo(() => {
    return searchMatchedExpenseItems.filter((item) => {
      const matchesCategory =
        categoryFilter === ALL_FILTER_VALUE || item.category === categoryFilter;

      const matchesType =
        typeFilter === ALL_FILTER_VALUE || item.type === typeFilter;

      return matchesCategory && matchesType;
    });
  }, [searchMatchedExpenseItems, categoryFilter, typeFilter]);

  const hasActiveFilter =
    categoryFilter !== ALL_FILTER_VALUE || typeFilter !== ALL_FILTER_VALUE;

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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <HistoryFilterSelect
                label="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={expenseCategoryFilterOptions}
              />

              <HistoryFilterSelect
                label="Type"
                value={typeFilter}
                onChange={setTypeFilter}
                options={expenseTypeFilterOptions}
              />
            </div>
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
