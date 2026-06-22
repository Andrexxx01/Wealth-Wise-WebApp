"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditInvestmentDialog from "@/features/investments/components/edit-investment-dialog";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { InvestmentItem } from "@/types/investment";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import { sortInvestmentHistoryItems } from "@/lib/finance-history-sorters";
import { formatInvestmentCategory } from "@/lib/finance-labels";
import HistoryPageShell from "@/components/dashboard/history-page-shell";

export default function InvestmentsHistoryPageClient() {
  const {
    selectedRecord: selectedInvestment,
    isEditDialogOpen: isEditInvestmentOpen,
    openEditDialog: handleOpenEditInvestment,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<InvestmentItem>();

  const { investmentItems, updateInvestment, deleteInvestment } = useFinance();

  const sortedInvestmentItems = sortInvestmentHistoryItems(investmentItems);

  return (
    <>
      <HistoryPageShell
        eyebrow="Investment History"
        title="All investment records"
        description="Review every investment position you have added to WealthWise."
        backHref="/investments"
        backLabel="Back to Investments"
        isEmpty={sortedInvestmentItems.length === 0}
        emptyTitle="No investment records yet"
        emptyDescription="Your full investment history will appear here after you add portfolio assets."
        emptyActionHref="/investments"
        emptyActionLabel="Add Investment"
      >
        {sortedInvestmentItems.map((item) => {
          const gainAmount = item.currentValue - item.investedAmount;
          const isPositive = gainAmount >= 0;

          return (
            <DashboardListItem
              key={item.id}
              title={item.assetName}
              subtitle={formatInvestmentCategory(item.category)}
              value={formatCurrency(item.currentValue)}
              meta={`Invested ${formatCurrency(item.investedAmount)} • ${formatDate(
                item.investedAt,
              )}`}
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
