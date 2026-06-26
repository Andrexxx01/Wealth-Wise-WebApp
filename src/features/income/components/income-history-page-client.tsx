"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySearchInput from "@/components/dashboard/history-search-input";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import { ALL_FILTER_VALUE } from "@/constants/history-filters";
import {
  INCOME_CATEGORY_OPTIONS,
  INCOME_FREQUENCY_OPTIONS,
} from "@/constants/finance-options";
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

const incomeInitialFilters = {
  category: ALL_FILTER_VALUE,
  frequency: ALL_FILTER_VALUE,
};

const incomeCategoryFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Categories" },
  ...INCOME_CATEGORY_OPTIONS,
] as const;

const incomeFrequencyFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Frequencies" },
  ...INCOME_FREQUENCY_OPTIONS,
] as const;

function doesIncomePassFilters(
  item: IncomeItem,
  filters: typeof incomeInitialFilters,
) {
  const matchesCategory =
    filters.category === ALL_FILTER_VALUE || item.category === filters.category;

  const matchesFrequency =
    filters.frequency === ALL_FILTER_VALUE ||
    item.frequency === filters.frequency;

  return matchesCategory && matchesFrequency;
}

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
    filteredItems: searchMatchedIncomeItems,
    hasSearchQuery,
  } = useHistorySearch(sortedIncomeItems, doesIncomeMatchSearch);

  const {
    filters,
    setFilter,
    filteredItems: filteredIncomeItems,
    hasActiveFilter,
  } = useHistoryFilters(
    searchMatchedIncomeItems,
    incomeInitialFilters,
    doesIncomePassFilters,
  );

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
            ? "Try changing your search keyword, category filter, or frequency filter."
            : "Your full income history will appear here after you add income records."
        }
        emptyActionHref="/income"
        emptyActionLabel="Add Income"
        toolbar={
          <div className="space-y-4">
            <HistorySearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search income by title, category, amount, or date..."
              resultCount={filteredIncomeItems.length}
              totalCount={sortedIncomeItems.length}
              recordLabel="income records"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </div>
          </div>
        }
      >
        {filteredIncomeItems.map((item) => (
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
