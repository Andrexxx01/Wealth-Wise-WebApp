"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditLoanDialog from "@/features/loans/components/edit-loan-dialog";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import useHistoryFilters from "@/hooks/use-history-filters";
import useHistorySearch from "@/hooks/use-history-search";
import { doesLoanMatchSearch } from "@/lib/finance-history-search";
import { sortLoanHistoryItems } from "@/lib/finance-history-sorters";
import { formatLoanCategory, formatLoanStatus } from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { LoanItem } from "@/types/loan";
import {
  doesLoanPassFilters,
  loanCategoryFilterOptions,
  loanInitialFilters,
  loanStatusFilterOptions,
} from "@/lib/finance-history-filters";
import HistoryControls from "@/components/dashboard/history-controls";
import HistoryDateRangeFilter from "@/components/dashboard/history-date-range-filter";
import HistorySortSelect from "@/components/dashboard/history-sort-select";
import useHistorySort from "@/hooks/use-history-sort";
import {
  historySortOptions,
  type HistorySortValue,
} from "@/lib/history-sort-options";
import useHistoryClearAll from "@/hooks/use-history-clear-all";

export default function LoansHistoryPageClient() {
  const {
    selectedRecord: selectedLoan,
    isEditDialogOpen: isEditLoanOpen,
    openEditDialog: handleOpenEditLoan,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<LoanItem>();

  const { loanItems, updateLoan, deleteLoan } = useFinance();

  const sortedLoanItems = sortLoanHistoryItems(loanItems);

  const {
    searchQuery,
    setSearchQuery,
    resetSearch,
    filteredItems: searchMatchedLoanItems,
    hasSearchQuery,
  } = useHistorySearch(sortedLoanItems, doesLoanMatchSearch);

  const {
    filters,
    setFilter,
    resetFilters,
    filteredItems: filteredLoanItems,
    hasActiveFilter,
  } = useHistoryFilters(
    searchMatchedLoanItems,
    loanInitialFilters,
    doesLoanPassFilters,
  );

  const {
    sortValue,
    setSortValue,
    resetSort,
    sortedItems: visibleLoanItems,
  } = useHistorySort({
    items: filteredLoanItems,
    getDateValue: (item) => item.dueDate ?? item.createdAt,
    getAmountValue: (item) => item.remainingBalance,
  });

  const handleClearAll = useHistoryClearAll({
    resetSearch,
    resetFilters,
    resetSort,
  });

  const isFiltering = hasSearchQuery || hasActiveFilter;

  return (
    <>
      <HistoryPageShell
        eyebrow="Loan History"
        title="All loan records"
        description="Review every loan account you have added to WealthWise."
        backHref="/loans"
        backLabel="Back to Loans"
        isEmpty={filteredLoanItems.length === 0}
        emptyTitle={
          isFiltering ? "No matching loan records" : "No loan records yet"
        }
        emptyDescription={
          isFiltering
            ? "Try changing your search keyword, category filter, status filter, or due date range."
            : "Your full loan history will appear here after you add loan accounts."
        }
        emptyActionHref="/loans"
        emptyActionLabel="Add Loan"
        toolbar={
          <HistoryControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search loans by title, lender, category, amount, or date..."
            resultCount={filteredLoanItems.length}
            totalCount={sortedLoanItems.length}
            recordLabel="loan records"
            hasActiveFilter={hasActiveFilter}
            isFiltering={isFiltering}
            onResetFilters={resetFilters}
            onClearAll={handleClearAll}
          >
            <HistoryFilterSelect
              label="Category"
              value={filters.category}
              onChange={(value) => setFilter("category", value)}
              options={loanCategoryFilterOptions}
            />

            <HistoryFilterSelect
              label="Status"
              value={filters.status}
              onChange={(value) => setFilter("status", value)}
              options={loanStatusFilterOptions}
            />

            <HistoryDateRangeFilter
              fromLabel="Due Date From"
              toLabel="Due Date To"
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              onDateFromChange={(value) => setFilter("dateFrom", value)}
              onDateToChange={(value) => setFilter("dateTo", value)}
            />

            <HistorySortSelect
              value={sortValue}
              onChange={(value) => setSortValue(value as HistorySortValue)}
              options={historySortOptions}
            />
          </HistoryControls>
        }
      >
        {visibleLoanItems.map((item) => (
          <DashboardListItem
            key={item.id}
            title={item.title}
            subtitle={`${item.lenderName} • ${formatLoanCategory(
              item.category,
            )}`}
            value={formatCurrency(item.remainingBalance)}
            meta={`Monthly ${formatCurrency(item.monthlyPayment)} • ${
              item.dueDate ? formatDate(item.dueDate) : "No due date"
            }`}
            tone={item.status === "PAID_OFF" ? "positive" : "default"}
          >
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-slate-500">
                Status: {formatLoanStatus(item.status)}
              </p>

              <RecordActionButtons
                onEdit={() => handleOpenEditLoan(item)}
                onDelete={() => deleteLoan(item.id)}
                deleteConfirmMessage="Are you sure you want to delete this loan record?"
              />
            </div>
          </DashboardListItem>
        ))}
      </HistoryPageShell>

      <EditLoanDialog
        open={isEditLoanOpen}
        onOpenChange={handleEditDialogChange}
        loan={selectedLoan}
        onUpdateLoan={updateLoan}
      />
    </>
  );
}
