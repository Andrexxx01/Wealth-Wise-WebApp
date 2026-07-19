"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import LoanFormFields from "@/features/loans/components/loan-form-fields";
import { createLoanSchema } from "@/features/loans/schemas/loan.schemas";
import { transformLoanFormValues } from "@/lib/form-transformers";
import type { AddLoanDialogProps } from "@/types/finance-dialog";
import type { CreateLoanFormValues } from "@/types/loan";
import { DEFAULT_LOAN_FORM_VALUES } from "@/constants/finance-form-defaults";

export default function AddLoanDialog({
  open,
  onOpenChange,
  onCreateLoan,
}: AddLoanDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLoanFormValues>({
    resolver: zodResolver(createLoanSchema),
    defaultValues: DEFAULT_LOAN_FORM_VALUES,
  });

  function handleCloseDialog() {
    reset();
    onOpenChange(false);
  }

  function handleDialogOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }

    onOpenChange(nextOpen);
  }

  async function onSubmit(values: CreateLoanFormValues) {
    try {
      const payload = transformLoanFormValues(values);

      await onCreateLoan(payload);

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create loan:", error);
    }
  }

  return (
    <FormDialogShell
      open={open}
      onOpenChange={handleDialogOpenChange}
      title="Add Loan"
      description="Add a new loan account to keep your debt overview accurate."
      formProps={{
        onSubmit: handleSubmit(onSubmit),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Add Loan"
          isSubmitting={isSubmitting}
          onCancel={handleCloseDialog}
        />
      }
    >
      <LoanFormFields register={register} errors={errors} />
    </FormDialogShell>
  );
}
