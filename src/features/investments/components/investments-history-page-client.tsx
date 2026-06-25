"use client";

import { useMemo, useState } from "react";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySearchInput from "@/components/dashboard/history-search-input";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import { INVESTMENT_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditInvestmentDialog from "@/features/investments/components/edit-investment-dialog";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import useHistorySearch from "@/hooks/use-history-search";
import { doesInvestmentMatchSearch } from "@/lib/finance-history-search";
import { sortInvestmentHistoryItems } from "@/lib/finance-history-sorters";
import { formatInvestmentCategory } from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { InvestmentItem } from "@/types/investment";

const ALL_FILTER_VALUE = "ALL";

const investmentCategoryFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Categories" },
  ...INVESTMENT_CATEGORY_OPTIONS,
] as const;

export default function InvestmentsHistoryPageClient() {
  const [categoryFilter, setCategoryFilter] = useState(ALL_FILTER_VALUE);

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
    filteredItems: searchMatchedInvestmentItems,
    hasSearchQuery,
  } = useHistorySearch(sortedInvestmentItems, doesInvestmentMatchSearch);

  const filteredInvestmentItems = useMemo(() => {
    return searchMatchedInvestmentItems.filter((item) => {
      const matchesCategory =
        categoryFilter === ALL_FILTER_VALUE || item.category === categoryFilter;

      return matchesCategory;
    });
  }, [searchMatchedInvestmentItems, categoryFilter]);

  const hasActiveFilter = categoryFilter !== ALL_FILTER_VALUE;

  const isFiltering = hasSearchQuery || hasActiveFilter;

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
            ? "Try changing your search keyword or category filter."
            : "Your full investment history will appear here after you add portfolio assets."
        }
        emptyActionHref="/investments"
        emptyActionLabel="Add Investment"
        toolbar={
          <div className="space-y-4">
            <HistorySearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search investments by asset, category, amount, or date..."
              resultCount={filteredInvestmentItems.length}
              totalCount={sortedInvestmentItems.length}
              recordLabel="investment records"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <HistoryFilterSelect
                label="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={investmentCategoryFilterOptions}
              />
            </div>
          </div>
        }
      >
        {filteredInvestmentItems.map((item) => {
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
