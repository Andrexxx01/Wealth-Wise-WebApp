"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import { LOAN_CATEGORY_OPTIONS } from "@/constants/finance-options";
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
      interestRate: loan.interestRate ? String(loan.interestRate) : "",
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          label="Loan Title"
          placeholder="Car loan"
          error={errors.title?.message}
          registration={register("title")}
        />

        <FormInput
          label="Lender Name"
          placeholder="Bank name"
          error={errors.lenderName?.message}
          registration={register("lenderName")}
        />

        <FormSelect
          label="Category"
          options={LOAN_CATEGORY_OPTIONS}
          error={errors.category?.message}
          registration={register("category")}
        />

        <FormInput
          label="Principal Amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="20000"
          error={errors.principalAmount?.message}
          registration={register("principalAmount")}
        />

        <FormInput
          label="Remaining Balance"
          type="number"
          min="0"
          step="0.01"
          placeholder="15000"
          error={errors.remainingBalance?.message}
          registration={register("remainingBalance")}
        />

        <FormInput
          label="Monthly Payment"
          type="number"
          min="0"
          step="0.01"
          placeholder="500"
          error={errors.monthlyPayment?.message}
          registration={register("monthlyPayment")}
        />

        <FormInput
          label="Interest Rate"
          type="number"
          min="0"
          step="0.01"
          placeholder="5.5"
          error={errors.interestRate?.message}
          registration={register("interestRate")}
        />

        <FormInput
          label="Due Date"
          type="date"
          error={errors.dueDate?.message}
          registration={register("dueDate")}
        />
      </div>
    </FormDialogShell>
  );
}
