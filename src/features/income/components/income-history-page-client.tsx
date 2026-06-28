"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySearchInput from "@/components/dashboard/history-search-input";
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
import HistoryFilterPanel from "@/components/dashboard/history-filter-panel";
import HistoryClearAllButton from "@/components/dashboard/history-clear-all-button";

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
    resetFilters,
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

            <HistoryFilterPanel
              hasActiveFilter={hasActiveFilter}
              onResetFilters={resetFilters}
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
