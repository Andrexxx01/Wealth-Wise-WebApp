"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import LoanFormFields from "@/features/loans/components/loan-form-fields";
import { createLoanSchema } from "@/features/loans/schemas/loan.schemas";
import { transformLoanFormValues } from "@/lib/form-transformers";
import type { CreateLoanPayload } from "@/types/form-payload";
import type { CreateLoanFormValues, LoanItem } from "@/types/loan";

type EditLoanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: LoanItem | null;
  onUpdateLoan: (loanId: string, payload: CreateLoanPayload) => void;
};

export default function EditLoanDialog({
  open,
  onOpenChange,
  loan,
  onUpdateLoan,
}: EditLoanDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLoanFormValues>({
    resolver: zodResolver(createLoanSchema),
    defaultValues: {
      title: "",
      lenderName: "",
      category: "PERSONAL",
      principalAmount: "",
      remainingBalance: "",
      monthlyPayment: "",
      interestRate: "",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (!loan) return;

    reset({
      title: loan.title,
      lenderName: loan.lenderName,
      category: loan.category,
      principalAmount: String(loan.principalAmount),
      remainingBalance: String(loan.remainingBalance),
      monthlyPayment: String(loan.monthlyPayment),
      interestRate: loan.interestRate === null ? "" : String(loan.interestRate),
      dueDate: loan.dueDate ?? "",
    });
  }, [loan, reset]);

  function handleCloseDialog() {
    onOpenChange(false);
  }

  function onSubmit(values: CreateLoanFormValues) {
    if (!loan) return;

    const payload = transformLoanFormValues(values);

    onUpdateLoan(loan.id, payload);
    onOpenChange(false);
  }

  return (
    <FormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Loan"
      description="Update your loan record details."
      formProps={{
        onSubmit: handleSubmit(onSubmit),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Save Changes"
          isSubmitting={isSubmitting}
          onCancel={handleCloseDialog}
        />
      }
    >
      <LoanFormFields register={register} errors={errors} />
    </FormDialogShell>
  );
}
