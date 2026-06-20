"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import IncomeFormFields from "@/features/income/components/income-form-fields";
import { createIncomeSchema } from "@/features/income/schemas/income.schema";
import { transformIncomeFormValues } from "@/lib/form-transformers";
import type { EditIncomeDialogProps } from "@/types/finance-dialog";
import type { CreateIncomeFormValues } from "@/types/income";
import { DEFAULT_INCOME_FORM_VALUES } from "@/constants/finance-form-defaults";

export default function EditIncomeDialog({
  open,
  onOpenChange,
  income,
  onUpdateIncome,
}: EditIncomeDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateIncomeFormValues>({
    resolver: zodResolver(createIncomeSchema),
    defaultValues: DEFAULT_INCOME_FORM_VALUES,
  });

  useEffect(() => {
    if (!income) return;

    reset({
      title: income.title,
      category: income.category,
      amount: String(income.amount),
      receivedAt: income.receivedAt,
      frequency: income.frequency,
      notes: income.notes ?? "",
    });
  }, [income, reset]);

  function handleCloseDialog() {
    onOpenChange(false);
  }

  function onSubmit(values: CreateIncomeFormValues) {
    if (!income) return;

    const payload = transformIncomeFormValues(values);

    onUpdateIncome(income.id, payload);
    onOpenChange(false);
  }

  return (
    <FormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Income"
      description="Update your income record details."
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
      <IncomeFormFields register={register} errors={errors} />
    </FormDialogShell>
  );
}
