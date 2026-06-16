"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import {
  INCOME_CATEGORY_OPTIONS,
  INCOME_FREQUENCY_OPTIONS,
} from "@/constants/finance-options";
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          label="Income Title"
          placeholder="Monthly salary"
          error={errors.title?.message}
          registration={register("title")}
        />

        <FormInput
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="5000"
          error={errors.amount?.message}
          registration={register("amount")}
        />

        <FormSelect
          label="Category"
          options={INCOME_CATEGORY_OPTIONS}
          error={errors.category?.message}
          registration={register("category")}
        />

        <FormSelect
          label="Frequency"
          options={INCOME_FREQUENCY_OPTIONS}
          error={errors.frequency?.message}
          registration={register("frequency")}
        />

        <FormInput
          label="Received Date"
          type="date"
          error={errors.receivedAt?.message}
          registration={register("receivedAt")}
        />

        <FormTextarea
          label="Notes"
          placeholder="Optional notes"
          error={errors.notes?.message}
          registration={register("notes")}
          className="md:col-span-2"
        />
      </div>
    </FormDialogShell>
  );
}
