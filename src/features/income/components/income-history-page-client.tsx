"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySearchInput from "@/components/dashboard/history-search-input";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditIncomeDialog from "@/features/income/components/edit-income-dialog";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import { sortIncomeHistoryItems } from "@/lib/finance-history-sorters";
import {
  formatIncomeCategory,
  formatIncomeFrequency,
} from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { IncomeItem } from "@/types/income";
import { doesIncomeMatchSearch } from "@/lib/finance-history-search";
import useHistorySearch from "@/hooks/use-history-search";

export default function IncomeHistoryPageClient() {
  const { incomeItems, updateIncome, deleteIncome } = useFinance();

  const sortedIncomeItems = sortIncomeHistoryItems(incomeItems);

  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredIncomeItems,
    hasSearchQuery,
  } = useHistorySearch(sortedIncomeItems, doesIncomeMatchSearch);

  const {
    selectedRecord: selectedIncome,
    isEditDialogOpen: isEditIncomeOpen,
    openEditDialog: handleOpenEditIncome,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<IncomeItem>();

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
          hasSearchQuery
            ? "No matching income records"
            : "No income records yet"
        }
        emptyDescription={
          hasSearchQuery
            ? "Try searching by title, category, frequency, amount, or received date."
            : "Your full income history will appear here after you add income records."
        }
        emptyActionHref="/income"
        emptyActionLabel="Add Income"
        toolbar={
          <HistorySearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search income by title, category, amount, or date..."
          />
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
