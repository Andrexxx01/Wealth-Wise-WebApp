"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditIncomeDialog from "@/features/income/components/edit-income-dialog";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { IncomeItem } from "@/types/income";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import { sortIncomeHistoryItems } from "@/lib/finance-history-sorters";
import {
  formatIncomeCategory,
  formatIncomeFrequency,
} from "@/lib/finance-labels";
import HistoryPageShell from "@/components/dashboard/history-page-shell";

export default function IncomeHistoryPageClient() {
  const {
    selectedRecord: selectedIncome,
    isEditDialogOpen: isEditIncomeOpen,
    openEditDialog: handleOpenEditIncome,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<IncomeItem>();

  const { incomeItems, updateIncome, deleteIncome } = useFinance();

  const sortedIncomeItems = sortIncomeHistoryItems(incomeItems);

  return (
    <>
      <HistoryPageShell
        eyebrow="Income History"
        title="All income records"
        description="Review every income record you have added to WealthWise."
        backHref="/income"
        backLabel="Back to Income"
        isEmpty={sortedIncomeItems.length === 0}
        emptyTitle="No income records yet"
        emptyDescription="Your full income history will appear here after you add income records."
        emptyActionHref="/income"
        emptyActionLabel="Add Income"
      >
        {sortedIncomeItems.map((item) => (
          <DashboardListItem
            key={item.id}
            title={item.title}
            subtitle={`${formatIncomeCategory(item.category)} • ${formatIncomeFrequency(
              item.frequency,
            )}`}
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
