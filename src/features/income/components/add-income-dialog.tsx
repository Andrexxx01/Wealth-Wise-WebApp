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
import { DEFAULT_INCOME_FORM_VALUES } from "@/constants/finance-form-defaults";

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
    defaultValues: DEFAULT_INCOME_FORM_VALUES,
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

  async function onSubmit(values: CreateIncomeFormValues) {
    try {
      const payload = transformIncomeFormValues(values);

      await onCreateIncome(payload);

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create income:", error);
    }
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
