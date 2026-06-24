"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySearchInput from "@/components/dashboard/history-search-input";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditLoanDialog from "@/features/loans/components/edit-loan-dialog";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import { sortLoanHistoryItems } from "@/lib/finance-history-sorters";
import { formatLoanCategory, formatLoanStatus } from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { LoanItem } from "@/types/loan";
import { doesLoanMatchSearch } from "@/lib/finance-history-search";
import useHistorySearch from "@/hooks/use-history-search";

export default function LoansHistoryPageClient() {
  const {
    selectedRecord: selectedLoan,
    isEditDialogOpen: isEditLoanOpen,
    openEditDialog: handleOpenEditLoan,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<LoanItem>();

  const { loanItems, updateLoan, deleteLoan } = useFinance();

  const sortedLoanItems = sortLoanHistoryItems(loanItems);

  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredLoanItems,
    hasSearchQuery,
  } = useHistorySearch(sortedLoanItems, doesLoanMatchSearch);

  return (
    <>
      <HistoryPageShell
        eyebrow="Loan History"
        title="All loan records"
        description="Review every loan account you have added to WealthWise."
        backHref="/loans"
        backLabel="Back to Loans"
        isEmpty={filteredLoanItems.length === 0}
        emptyTitle={
          hasSearchQuery ? "No matching loan records" : "No loan records yet"
        }
        emptyDescription={
          hasSearchQuery
            ? "Try searching by loan title, lender, category, status, amount, interest rate, or due date."
            : "Your full loan history will appear here after you add loan accounts."
        }
        emptyActionHref="/loans"
        emptyActionLabel="Add Loan"
        toolbar={
          <HistorySearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search loans by title, lender, category, amount, or date..."
          />
        }
      >
        {filteredLoanItems.map((item) => (
          <DashboardListItem
            key={item.id}
            title={item.title}
            subtitle={`${item.lenderName} • ${formatLoanCategory(
              item.category,
            )}`}
            value={formatCurrency(item.remainingBalance)}
            meta={`Monthly ${formatCurrency(item.monthlyPayment)} • ${
              item.dueDate ? formatDate(item.dueDate) : "No due date"
            }`}
            tone={item.status === "PAID_OFF" ? "positive" : "default"}
          >
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-slate-500">
                Status: {formatLoanStatus(item.status)}
              </p>

              <RecordActionButtons
                onEdit={() => handleOpenEditLoan(item)}
                onDelete={() => deleteLoan(item.id)}
                deleteConfirmMessage="Are you sure you want to delete this loan record?"
              />
            </div>
          </DashboardListItem>
        ))}
      </HistoryPageShell>

      <EditLoanDialog
        open={isEditLoanOpen}
        onOpenChange={handleEditDialogChange}
        loan={selectedLoan}
        onUpdateLoan={updateLoan}
      />
    </>
  );
}
