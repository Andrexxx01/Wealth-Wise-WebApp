"use client";

import { useMemo, useState } from "react";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySearchInput from "@/components/dashboard/history-search-input";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import {
  INCOME_CATEGORY_OPTIONS,
  INCOME_FREQUENCY_OPTIONS,
} from "@/constants/finance-options";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditIncomeDialog from "@/features/income/components/edit-income-dialog";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import useHistorySearch from "@/hooks/use-history-search";
import { doesIncomeMatchSearch } from "@/lib/finance-history-search";
import { sortIncomeHistoryItems } from "@/lib/finance-history-sorters";
import {
  formatIncomeCategory,
  formatIncomeFrequency,
} from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { IncomeItem } from "@/types/income";

const ALL_FILTER_VALUE = "ALL";

const incomeCategoryFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Categories" },
  ...INCOME_CATEGORY_OPTIONS,
] as const;

const incomeFrequencyFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Frequencies" },
  ...INCOME_FREQUENCY_OPTIONS,
] as const;

export default function IncomeHistoryPageClient() {
  const [categoryFilter, setCategoryFilter] = useState(ALL_FILTER_VALUE);
  const [frequencyFilter, setFrequencyFilter] = useState(ALL_FILTER_VALUE);

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

  const filteredIncomeItems = useMemo(() => {
    return searchMatchedIncomeItems.filter((item) => {
      const matchesCategory =
        categoryFilter === ALL_FILTER_VALUE || item.category === categoryFilter;

      const matchesFrequency =
        frequencyFilter === ALL_FILTER_VALUE ||
        item.frequency === frequencyFilter;

      return matchesCategory && matchesFrequency;
    });
  }, [searchMatchedIncomeItems, categoryFilter, frequencyFilter]);

  const hasActiveFilter =
    categoryFilter !== ALL_FILTER_VALUE || frequencyFilter !== ALL_FILTER_VALUE;

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
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={incomeCategoryFilterOptions}
              />

              <HistoryFilterSelect
                label="Frequency"
                value={frequencyFilter}
                onChange={setFrequencyFilter}
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
