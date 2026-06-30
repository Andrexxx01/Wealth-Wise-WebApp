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
import { useMemo, useState } from "react";
import HistorySortSelect from "@/components/dashboard/history-sort-select";
import {
  HISTORY_SORT_VALUES,
  historySortOptions,
  type HistorySortValue,
} from "@/lib/history-sort-options";

function sortFilteredIncomeItems(
  items: IncomeItem[],
  sortValue: HistorySortValue,
) {
  return [...items].sort((currentItem, nextItem) => {
    if (sortValue === HISTORY_SORT_VALUES.OLDEST) {
      return (
        new Date(currentItem.receivedAt).getTime() -
        new Date(nextItem.receivedAt).getTime()
      );
    }

    if (sortValue === HISTORY_SORT_VALUES.HIGHEST_AMOUNT) {
      return nextItem.amount - currentItem.amount;
    }

    if (sortValue === HISTORY_SORT_VALUES.LOWEST_AMOUNT) {
      return currentItem.amount - nextItem.amount;
    }

    return (
      new Date(nextItem.receivedAt).getTime() -
      new Date(currentItem.receivedAt).getTime()
    );
  });
}

export default function IncomeHistoryPageClient() {
  const [sortValue, setSortValue] = useState<HistorySortValue>(
    HISTORY_SORT_VALUES.NEWEST,
  );

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

  const visibleIncomeItems = useMemo(() => {
    return sortFilteredIncomeItems(filteredIncomeItems, sortValue);
  }, [filteredIncomeItems, sortValue]);

  const isFiltering = hasSearchQuery || hasActiveFilter;

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

            <HistorySortSelect
              value={sortValue}
              onChange={(value) => setSortValue(value as HistorySortValue)}
              options={historySortOptions}
            />
          </HistoryControls>
        }
      >
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
