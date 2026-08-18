"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import HistoryControls from "@/components/dashboard/history-controls";
import HistoryDateRangeFilter from "@/components/dashboard/history-date-range-filter";
import HistorySortSelect from "@/components/dashboard/history-sort-select";
import HistorySummaryGrid from "@/components/dashboard/history-summary-grid";

import { useFinance } from "@/features/finance/components/finance-provider";
import { useConvertedFinanceItems } from "@/features/finance/hooks/use-converted-finance-items";
import EditInvestmentDialog from "@/features/investments/components/edit-investment-dialog";

import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import useHistoryFilters from "@/hooks/use-history-filters";
import useHistorySearch from "@/hooks/use-history-search";
import useHistorySort from "@/hooks/use-history-sort";
import useHistoryClearAll from "@/hooks/use-history-clear-all";

import { doesInvestmentMatchSearch } from "@/lib/finance-history-search";
import { sortInvestmentHistoryItems } from "@/lib/finance-history-sorters";
import { formatInvestmentCategory } from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";

import {
  doesInvestmentPassFilters,
  investmentCategoryFilterOptions,
  investmentInitialFilters,
} from "@/lib/finance-history-filters";

import {
  historySortOptions,
  type HistorySortValue,
} from "@/lib/history-sort-options";

import type { InvestmentItem } from "@/types/investment";

export default function InvestmentsHistoryPageClient() {
  const {
    selectedRecord: selectedInvestment,
    isEditDialogOpen: isEditInvestmentOpen,
    openEditDialog: handleOpenEditInvestment,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<InvestmentItem>();

  const { investmentItems, updateInvestment, deleteInvestment } = useFinance();

  const {
    investmentItems: convertedInvestmentItems,
    displayCurrency,
    isCurrencyConversionReady,
  } = useConvertedFinanceItems();

  const convertedInvestmentById = new Map(
    convertedInvestmentItems.map((item) => [item.id, item]),
  );

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

    getAmountValue: (item) =>
      isCurrencyConversionReady
        ? (convertedInvestmentById.get(item.id)?.investedAmount ?? 0)
        : 0,
  });

  const handleClearAll = useHistoryClearAll({
    resetSearch,
    resetFilters,
    resetSort,
  });

  const isFiltering = hasSearchQuery || hasActiveFilter;
  const hasActiveControls = isFiltering || hasActiveSort;

  const totalVisibleInvested = visibleInvestmentItems.reduce((total, item) => {
    const convertedItem = convertedInvestmentById.get(item.id);

    return total + (convertedItem?.investedAmount ?? 0);
  }, 0);

  const averageVisibleInvestment =
    visibleInvestmentItems.length > 0
      ? totalVisibleInvested / visibleInvestmentItems.length
      : 0;

  return (
    <>
      <HistoryPageShell
        eyebrow="Investment History"
        title="All investment transactions"
        description="Review every investment transaction you have recorded in WealthWise."
        backHref="/investments"
        backLabel="Back to Investments"
        isEmpty={filteredInvestmentItems.length === 0}
        emptyTitle={
          isFiltering
            ? "No matching investment transactions"
            : "No investment transactions yet"
        }
        emptyDescription={
          isFiltering
            ? "Try changing your search keyword, category filter, or date range."
            : "Your investment transactions will appear here after you record your first investment."
        }
        emptyActionHref="/investments"
        emptyActionLabel="Add Investment"
        toolbar={
          <HistoryControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by asset, symbol, category, amount, or date..."
            resultCount={filteredInvestmentItems.length}
            totalCount={sortedInvestmentItems.length}
            recordLabel="investment transactions"
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
              label: "Total Invested",
              value: isCurrencyConversionReady
                ? formatCurrency(totalVisibleInvested, displayCurrency)
                : "—",
              description: "Total amount invested from visible transactions.",
            },
            {
              label: "Transactions",
              value: String(visibleInvestmentItems.length),
              description: "Investment transactions currently shown.",
            },
            {
              label: "Average Investment",
              value: isCurrencyConversionReady
                ? formatCurrency(averageVisibleInvestment, displayCurrency)
                : "—",
              description: "Average invested amount per visible transaction.",
            },
          ]}
        />

        {visibleInvestmentItems.map((item) => {
          const assetTitle = item.symbol
            ? `${item.assetName} (${item.symbol})`
            : item.assetName;

          const quantityText =
            item.quantity !== null
              ? `${item.quantity} ${item.symbol ?? "units"}`
              : "Quantity unavailable";

          const feeText = `Fee ${formatCurrency(
            item.feeAmount,
            item.currency,
          )}`;

          return (
            <DashboardListItem
              key={item.id}
              title={assetTitle}
              subtitle={formatInvestmentCategory(item.category)}
              value={formatCurrency(item.investedAmount, item.currency)}
              meta={[quantityText, feeText, formatDate(item.investedAt)].join(
                " • ",
              )}
            >
              <RecordActionButtons
                className="mt-4"
                onEdit={() => handleOpenEditInvestment(item)}
                onDelete={() => deleteInvestment(item.id)}
                deleteConfirmMessage="Are you sure you want to delete this investment transaction?"
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
