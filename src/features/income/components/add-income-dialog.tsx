"use client";

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
import type { CreateIncomeFormValues } from "@/types/income";

type AddIncomeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const today = new Date().toISOString().slice(0, 10);

export default function AddIncomeDialog({
  open,
  onOpenChange,
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
      receivedAt: today,
      frequency: "MONTHLY",
      notes: "",
    },
  });

  function handleDialogOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }

    onOpenChange(nextOpen);
  }

  function onSubmit(values: CreateIncomeFormValues) {
    console.log("Income form values:", values);

    reset();
    onOpenChange(false);
  }

  return (
    <FormDialogShell
      open={open}
      onOpenChange={handleDialogOpenChange}
      title="Add Income"
      description="Record salary, freelance payment, business income, or any other money you received."
      formProps={{
        onSubmit: handleSubmit(onSubmit),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Save Income"
          isSubmitting={isSubmitting}
          onCancel={() => handleDialogOpenChange(false)}
        />
      }
    >
      <FormInput
        label="Income Title"
        placeholder="Primary Salary"
        registration={register("title")}
        error={errors.title?.message}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormSelect
          label="Category"
          options={INCOME_CATEGORY_OPTIONS}
          registration={register("category")}
          error={errors.category?.message}
        />

        <FormSelect
          label="Frequency"
          options={INCOME_FREQUENCY_OPTIONS}
          registration={register("frequency")}
          error={errors.frequency?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormInput
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="5500"
          registration={register("amount")}
          error={errors.amount?.message}
        />

        <FormInput
          label="Received Date"
          type="date"
          registration={register("receivedAt")}
          error={errors.receivedAt?.message}
        />
      </div>

      <FormTextarea
        label="Notes"
        placeholder="Optional note..."
        registration={register("notes")}
        error={errors.notes?.message}
      />
    </FormDialogShell>
  );
}
