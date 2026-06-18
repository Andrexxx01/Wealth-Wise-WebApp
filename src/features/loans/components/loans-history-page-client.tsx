"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import EmptyState from "@/components/dashboard/empty-state";
import SectionHeader from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LOAN_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { useFinance } from "@/features/finance/components/finance-provider";
import EditLoanDialog from "@/features/loans/components/edit-loan-dialog";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { LoanItem } from "@/types/loan";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";

function formatLoanCategory(category: string) {
  const categoryOption = LOAN_CATEGORY_OPTIONS.find(
    (option) => option.value === category,
  );

  return categoryOption?.label ?? category;
}

function formatLoanStatus(status: string) {
  const statusLabels: Record<string, string> = {
    ACTIVE: "Active",
    PAID_OFF: "Paid Off",
    OVERDUE: "Overdue",
  };

  return statusLabels[status] ?? status;
}

export default function LoansHistoryPageClient() {
  const [selectedLoan, setSelectedLoan] = useState<LoanItem | null>(null);
  const [isEditLoanOpen, setIsEditLoanOpen] = useState(false);

  const { loanItems, updateLoan, deleteLoan } = useFinance();

  const sortedLoanItems = [...loanItems].sort((currentItem, nextItem) => {
    const currentDate = currentItem.dueDate ?? currentItem.createdAt;
    const nextDate = nextItem.dueDate ?? nextItem.createdAt;

    return new Date(nextDate).getTime() - new Date(currentDate).getTime();
  });

  function handleOpenEditLoan(loan: LoanItem) {
    setSelectedLoan(loan);
    setIsEditLoanOpen(true);
  }

  function handleEditDialogChange(open: boolean) {
    setIsEditLoanOpen(open);

    if (!open) {
      setSelectedLoan(null);
    }
  }

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
