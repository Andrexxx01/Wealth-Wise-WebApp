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
import { mapIncomeItemToFormValues } from "@/lib/finance-form-mappers";

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

    reset(mapIncomeItemToFormValues(income));
  }, [income, reset]);

  function handleCloseDialog() {
    onOpenChange(false);
  }

  async function onSubmit(values: CreateIncomeFormValues) {
    if (!income) return;

    try {
      const payload = transformIncomeFormValues(values);

      await onUpdateIncome(income.id, payload);

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update income:", error);
    }
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
