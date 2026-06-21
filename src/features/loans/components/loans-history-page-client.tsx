"use client";

import Link from "next/link";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import EmptyState from "@/components/dashboard/empty-state";
import SectionHeader from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditLoanDialog from "@/features/loans/components/edit-loan-dialog";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { LoanItem } from "@/types/loan";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";
import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
import { sortLoanHistoryItems } from "@/lib/finance-history-sorters";
import { formatLoanCategory, formatLoanStatus } from "@/lib/finance-labels";

export default function LoansHistoryPageClient() {
  const {
    selectedRecord: selectedLoan,
    isEditDialogOpen: isEditLoanOpen,
    openEditDialog: handleOpenEditLoan,
    handleEditDialogOpenChange: handleEditDialogChange,
  } = useEditRecordDialog<LoanItem>();

  const { loanItems, updateLoan, deleteLoan } = useFinance();

  const sortedLoanItems = sortLoanHistoryItems(loanItems);

  return (
    <>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Loan History"
          title="All loan records"
          description="Review every loan account you have added to WealthWise."
          action={
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-2xl border-slate-300 bg-white px-6 font-semibold text-slate-900 hover:bg-slate-100"
            >
              <Link href="/loans">Back to Loans</Link>
            </Button>
          }
        />

        <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
          <CardContent className="p-6">
            {sortedLoanItems.length > 0 ? (
              <div className="space-y-4">
                {sortedLoanItems.map((item) => (
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
              </div>
            ) : (
              <EmptyState
                title="No loan records yet"
                description="Your full loan history will appear here after you add loan accounts."
                action={
                  <Button
                    asChild
                    className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                  >
                    <Link href="/loans">Add Loan</Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      <EditLoanDialog
        open={isEditLoanOpen}
        onOpenChange={handleEditDialogChange}
        loan={selectedLoan}
        onUpdateLoan={updateLoan}
      />
    </>
  );
}
