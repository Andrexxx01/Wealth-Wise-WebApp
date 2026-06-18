"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import IncomeFormFields from "@/features/income/components/income-form-fields";
import { createIncomeSchema } from "@/features/income/schemas/income.schema";
import { transformIncomeFormValues } from "@/lib/form-transformers";
import type { AddIncomeDialogProps } from "@/types/finance-dialog";
import type { CreateIncomeFormValues } from "@/types/income";

export default function AddIncomeDialog({
  open,
  onOpenChange,
  onCreateIncome,
}: AddIncomeDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateIncomeFormValues>({
    resolver: zodResolver(createIncomeSchema),
    defaultValues: {
      title: "",
      category: "SALARY",
      amount: "",
      receivedAt: "",
      frequency: "MONTHLY",
      notes: "",
    },
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

  function onSubmit(values: CreateIncomeFormValues) {
    const payload = transformIncomeFormValues(values);

    onCreateIncome(payload);
    reset();
    onOpenChange(false);
  }

  return (
    <FormDialogShell
      open={open}
      onOpenChange={handleDialogOpenChange}
      title="Add Income"
      description="Add a new income record to keep your financial overview accurate."
      formProps={{
        onSubmit: handleSubmit(onSubmit),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Add Income"
          isSubmitting={isSubmitting}
          onCancel={handleCloseDialog}
        />
      }
    >
      <IncomeFormFields register={register} errors={errors} />
    </FormDialogShell>
  );
}
