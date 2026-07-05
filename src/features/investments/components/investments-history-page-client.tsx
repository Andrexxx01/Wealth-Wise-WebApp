"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditInvestmentDialog from "@/features/investments/components/edit-investment-dialog";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import useHistoryFilters from "@/hooks/use-history-filters";
import useHistorySearch from "@/hooks/use-history-search";
import { doesInvestmentMatchSearch } from "@/lib/finance-history-search";
import { sortInvestmentHistoryItems } from "@/lib/finance-history-sorters";
import { formatInvestmentCategory } from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { InvestmentItem } from "@/types/investment";
import {
  doesInvestmentPassFilters,
  investmentCategoryFilterOptions,
  investmentInitialFilters,
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

export default function InvestmentsHistoryPageClient() {
  const {
    selectedRecord: selectedInvestment,
    isEditDialogOpen: isEditInvestmentOpen,
    openEditDialog: handleOpenEditInvestment,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<InvestmentItem>();

  const { investmentItems, updateInvestment, deleteInvestment } = useFinance();

  const sortedInvestmentItems = sortInvestmentHistoryItems(investmentItems);

  const {
    searchQuery,
    setSearchQuery,
    resetSearch,
    filteredItems: searchMatchedInvestmentItems,
    hasSearchQuery,
  } = useHistorySearch(sortedInvestmentItems, doesInvestmentMatchSearch);

  const {
    filters,
    setFilter,
    resetFilters,
    filteredItems: filteredInvestmentItems,
    hasActiveFilter,
  } = useHistoryFilters(
    searchMatchedInvestmentItems,
    investmentInitialFilters,
    doesInvestmentPassFilters,
  );

  const {
    sortValue,
    setSortValue,
    resetSort,
    hasActiveSort,
    sortedItems: visibleInvestmentItems,
  } = useHistorySort({
    items: filteredInvestmentItems,
    getDateValue: (item) => item.investedAt,
    getAmountValue: (item) => item.currentValue,
  });

  const handleClearAll = useHistoryClearAll({
    resetSearch,
    resetFilters,
    resetSort,
  });

  const isFiltering = hasSearchQuery || hasActiveFilter;
  const hasActiveControls = isFiltering || hasActiveSort;

  const totalVisibleCurrentValue = visibleInvestmentItems.reduce(
    (total, item) => total + item.currentValue,
    0,
  );

  const averageVisibleCurrentValue =
    visibleInvestmentItems.length > 0
      ? totalVisibleCurrentValue / visibleInvestmentItems.length
      : 0;

  return (
    <>
      <HistoryPageShell
        eyebrow="Investment History"
        title="All investment records"
        description="Review every investment position you have added to WealthWise."
        backHref="/investments"
        backLabel="Back to Investments"
        isEmpty={filteredInvestmentItems.length === 0}
        emptyTitle={
          isFiltering
            ? "No matching investment records"
            : "No investment records yet"
        }
        emptyDescription={
          isFiltering
            ? "Try changing your search keyword, category filter, or date range."
            : "Your full investment history will appear here after you add portfolio assets."
        }
        emptyActionHref="/investments"
        emptyActionLabel="Add Investment"
        toolbar={
          <HistoryControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search investments by asset, category, amount, or date..."
            resultCount={filteredInvestmentItems.length}
            totalCount={sortedInvestmentItems.length}
            recordLabel="investment records"
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
              options={investmentCategoryFilterOptions}
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
              label: "Total Current Value",
              value: formatCurrency(totalVisibleCurrentValue),
              description: "Total current value from visible records.",
            },
            {
              label: "Records",
              value: String(visibleInvestmentItems.length),
              description: "Investment records currently shown.",
            },
            {
              label: "Average Current Value",
              value: formatCurrency(averageVisibleCurrentValue),
              description: "Average current value per visible record.",
            },
          ]}
        />
        
        {visibleInvestmentItems.map((item) => {
          const gainAmount = item.currentValue - item.investedAmount;
          const isPositive = gainAmount >= 0;

          return (
            <DashboardListItem
              key={item.id}
              title={item.assetName}
              subtitle={formatInvestmentCategory(item.category)}
              value={formatCurrency(item.currentValue)}
              meta={`Invested ${formatCurrency(
                item.investedAmount,
              )} • ${formatDate(item.investedAt)}`}
              tone={isPositive ? "positive" : "danger"}
            >
              <RecordActionButtons
                className="mt-4"
                onEdit={() => handleOpenEditInvestment(item)}
                onDelete={() => deleteInvestment(item.id)}
                deleteConfirmMessage="Are you sure you want to delete this investment record?"
              />
            </DashboardListItem>
          );
        })}
      </HistoryPageShell>

      <EditInvestmentDialog
        open={isEditInvestmentOpen}
        onOpenChange={handleEditDialogChange}
        investment={selectedInvestment}
        onUpdateInvestment={updateInvestment}
      />
    </>
  );
}
