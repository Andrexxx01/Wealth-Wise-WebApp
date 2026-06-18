"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import IncomeFormFields from "@/features/income/components/income-form-fields";
import { createIncomeSchema } from "@/features/income/schemas/income.schema";
import { transformIncomeFormValues } from "@/lib/form-transformers";
import type { CreateIncomePayload } from "@/types/form-payload";
import type { CreateIncomeFormValues, IncomeItem } from "@/types/income";

type EditIncomeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income: IncomeItem | null;
  onUpdateIncome: (incomeId: string, payload: CreateIncomePayload) => void;
};

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
    defaultValues: {
      title: "",
      category: "SALARY",
      amount: "",
      receivedAt: "",
      frequency: "MONTHLY",
      notes: "",
    },
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
