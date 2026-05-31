"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import { LOAN_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { createLoanSchema } from "@/features/loans/schemas/loan.schemas";
import { transformLoanFormValues } from "@/lib/form-transformers";
import type { AddLoanDialogProps } from "@/types/finance-dialog";
import type { CreateLoanFormValues } from "@/types/loan";

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

  function handleDialogOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }

    onOpenChange(nextOpen);
  }

  function onSubmit(values: CreateLoanFormValues) {
    const payload = transformLoanFormValues(values);

    onCreateLoan(payload);

    reset();
    onOpenChange(false);
  }

  return (
    <FormDialogShell
      open={open}
      onOpenChange={handleDialogOpenChange}
      title="Add Loan"
      description="Record loan balances, monthly obligations, due dates, and repayment details so your debt stays visible and under control."
      formProps={{
        onSubmit: handleSubmit(onSubmit),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Save Loan"
          isSubmitting={isSubmitting}
          onCancel={() => handleDialogOpenChange(false)}
        />
      }
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormInput
          label="Loan Title"
          placeholder="Laptop Installment"
          registration={register("title")}
          error={errors.title?.message}
        />

        <FormInput
          label="Lender Name"
          placeholder="Tech Store"
          registration={register("lenderName")}
          error={errors.lenderName?.message}
        />
      </div>

      <FormSelect
        label="Category"
        options={LOAN_CATEGORY_OPTIONS}
        registration={register("category")}
        error={errors.category?.message}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormInput
          label="Principal Amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="2000"
          registration={register("principalAmount")}
          error={errors.principalAmount?.message}
        />

        <FormInput
          label="Remaining Balance"
          type="number"
          min="0"
          step="0.01"
          placeholder="650"
          registration={register("remainingBalance")}
          error={errors.remainingBalance?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormInput
          label="Monthly Payment"
          type="number"
          min="0"
          step="0.01"
          placeholder="120"
          registration={register("monthlyPayment")}
          error={errors.monthlyPayment?.message}
        />

        <FormInput
          label="Interest Rate"
          type="number"
          min="0"
          step="0.01"
          placeholder="5.5"
          registration={register("interestRate")}
          error={errors.interestRate?.message}
        />
      </div>

      <FormInput
        label="Due Date"
        type="date"
        registration={register("dueDate")}
        error={errors.dueDate?.message}
      />
    </FormDialogShell>
  );
}
