"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditIncomeDialog from "@/features/income/components/edit-income-dialog";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import useHistoryFilters from "@/hooks/use-history-filters";
import useHistorySearch from "@/hooks/use-history-search";
import { doesIncomeMatchSearch } from "@/lib/finance-history-search";
import { sortIncomeHistoryItems } from "@/lib/finance-history-sorters";
import {
  formatIncomeCategory,
  formatIncomeFrequency,
} from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { IncomeItem } from "@/types/income";
import {
  doesIncomePassFilters,
  incomeCategoryFilterOptions,
  incomeFrequencyFilterOptions,
  incomeInitialFilters,
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
import HistorySummaryGrid from "@/components/dashboard/history-summary-grid";

export default function IncomeHistoryPageClient() {
  const {
    selectedRecord: selectedIncome,
    isEditDialogOpen: isEditIncomeOpen,
    openEditDialog: handleOpenEditIncome,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<IncomeItem>();

  const { incomeItems, updateIncome, deleteIncome } = useFinance();

  const sortedIncomeItems = sortIncomeHistoryItems(incomeItems);

  const {
    searchQuery,
    setSearchQuery,
    resetSearch,
    filteredItems: searchMatchedIncomeItems,
    hasSearchQuery,
  } = useHistorySearch(sortedIncomeItems, doesIncomeMatchSearch);

  const {
    filters,
    setFilter,
    resetFilters,
    filteredItems: filteredIncomeItems,
    hasActiveFilter,
  } = useHistoryFilters(
    searchMatchedIncomeItems,
    incomeInitialFilters,
    doesIncomePassFilters,
  );

  const {
    sortValue,
    setSortValue,
    resetSort,
    hasActiveSort,
    sortedItems: visibleIncomeItems,
  } = useHistorySort({
    items: filteredIncomeItems,
    getDateValue: (item) => item.receivedAt,
    getAmountValue: (item) => item.amount,
  });

  const handleClearAll = useHistoryClearAll({
    resetSearch,
    resetFilters,
    resetSort,
  });

  const isFiltering = hasSearchQuery || hasActiveFilter;
  const hasActiveControls = isFiltering || hasActiveSort;

  const totalVisibleIncome = visibleIncomeItems.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const averageVisibleIncome =
    visibleIncomeItems.length > 0
      ? totalVisibleIncome / visibleIncomeItems.length
      : 0;

  return (
    <>
      <HistoryPageShell
        eyebrow="Income History"
        title="All income records"
        description="Review every income record you have added to WealthWise."
        backHref="/income"
        backLabel="Back to Income"
        isEmpty={filteredIncomeItems.length === 0}
        emptyTitle={
          isFiltering ? "No matching income records" : "No income records yet"
        }
        emptyDescription={
          isFiltering
            ? "Try changing your search keyword, category filter, frequency filter, or date range."
            : "Your full income history will appear here after you add income records."
        }
        emptyActionHref="/income"
        emptyActionLabel="Add Income"
        toolbar={
          <HistoryControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search income by title, category, amount, or date..."
            resultCount={filteredIncomeItems.length}
            totalCount={sortedIncomeItems.length}
            recordLabel="income records"
            hasActiveFilter={hasActiveFilter}
            showClearAllButton={hasActiveControls}
            onResetFilters={resetFilters}
            onClearAll={handleClearAll}
            sortControl={
              <HistorySortSelect
                value={sortValue}
                onChange={(value) => setSortValue(value as HistorySortValue)}
                options={historySortOptions}
              />
            }
          >
            <HistoryFilterSelect
              label="Category"
              value={filters.category}
              onChange={(value) => setFilter("category", value)}
              options={incomeCategoryFilterOptions}
            />

            <HistoryFilterSelect
              label="Frequency"
              value={filters.frequency}
              onChange={(value) => setFilter("frequency", value)}
              options={incomeFrequencyFilterOptions}
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
        <HistorySummaryGrid
          items={[
            {
              label: "Total Income",
              value: formatCurrency(totalVisibleIncome),
              description: "Total amount from visible records.",
            },
            {
              label: "Records",
              value: String(visibleIncomeItems.length),
              description: "Income records currently shown.",
            },
            {
              label: "Average Income",
              value: formatCurrency(averageVisibleIncome),
              description: "Average amount per visible record.",
            },
          ]}
        />
        
        {visibleIncomeItems.map((item) => (
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
      </HistoryPageShell>

      <EditIncomeDialog
        open={isEditIncomeOpen}
        onOpenChange={handleEditDialogChange}
        income={selectedIncome}
        onUpdateIncome={updateIncome}
      />
    </>
  );
}
