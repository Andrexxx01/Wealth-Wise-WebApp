"use client";

import { useMemo, useState } from "react";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySearchInput from "@/components/dashboard/history-search-input";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import { LOAN_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditLoanDialog from "@/features/loans/components/edit-loan-dialog";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import useHistorySearch from "@/hooks/use-history-search";
import { doesLoanMatchSearch } from "@/lib/finance-history-search";
import { sortLoanHistoryItems } from "@/lib/finance-history-sorters";
import { formatLoanCategory, formatLoanStatus } from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { LoanItem } from "@/types/loan";

const ALL_FILTER_VALUE = "ALL";

const loanCategoryFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Categories" },
  ...LOAN_CATEGORY_OPTIONS,
] as const;

const loanStatusFilterOptions = [
  { value: ALL_FILTER_VALUE, label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAID_OFF", label: "Paid Off" },
  { value: "OVERDUE", label: "Overdue" },
] as const;

export default function LoansHistoryPageClient() {
  const [categoryFilter, setCategoryFilter] = useState(ALL_FILTER_VALUE);
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);

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
    filteredItems: searchMatchedLoanItems,
    hasSearchQuery,
  } = useHistorySearch(sortedLoanItems, doesLoanMatchSearch);

  const filteredLoanItems = useMemo(() => {
    return searchMatchedLoanItems.filter((item) => {
      const matchesCategory =
        categoryFilter === ALL_FILTER_VALUE || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === ALL_FILTER_VALUE || item.status === statusFilter;

      return matchesCategory && matchesStatus;
    });
  }, [searchMatchedLoanItems, categoryFilter, statusFilter]);

  const hasActiveFilter =
    categoryFilter !== ALL_FILTER_VALUE || statusFilter !== ALL_FILTER_VALUE;

  const isFiltering = hasSearchQuery || hasActiveFilter;

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
          isFiltering ? "No matching loan records" : "No loan records yet"
        }
        emptyDescription={
          isFiltering
            ? "Try changing your search keyword, category filter, or status filter."
            : "Your full loan history will appear here after you add loan accounts."
        }
        emptyActionHref="/loans"
        emptyActionLabel="Add Loan"
        toolbar={
          <div className="space-y-4">
            <HistorySearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search loans by title, lender, category, amount, or date..."
              resultCount={filteredLoanItems.length}
              totalCount={sortedLoanItems.length}
              recordLabel="loan records"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <HistoryFilterSelect
                label="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={loanCategoryFilterOptions}
              />

              <HistoryFilterSelect
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={loanStatusFilterOptions}
              />
            </div>
          </div>
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
