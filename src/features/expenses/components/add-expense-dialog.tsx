"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import {
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_TYPE_OPTIONS,
} from "@/constants/finance-options";
import { createExpenseSchema } from "@/features/expenses/schemas/expense.schema";
import type { CreateExpenseFormValues } from "@/types/expense";

type AddExpenseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const today = new Date().toISOString().slice(0, 10);

export default function AddExpenseDialog({
  open,
  onOpenChange,
}: AddExpenseDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateExpenseFormValues>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      title: "",
      category: "FOOD",
      type: "ESSENTIAL",
      amount: "",
      spentAt: today,
      notes: "",
    },
  });

  function handleDialogOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }

    onOpenChange(nextOpen);
  }

  function onSubmit(values: CreateExpenseFormValues) {
    console.log("Expense form values:", values);

    reset();
    onOpenChange(false);
  }

  return (
    <FormDialogShell
      open={open}
      onOpenChange={handleDialogOpenChange}
      title="Add Expense"
      description="Record daily spending, bills, subscriptions, and other expenses so your financial overview stays accurate."
      formProps={{
        onSubmit: handleSubmit(onSubmit),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Save Expense"
          isSubmitting={isSubmitting}
          onCancel={() => handleDialogOpenChange(false)}
        />
      }
    >
      <FormInput
        label="Expense Title"
        placeholder="Supermarket"
        registration={register("title")}
        error={errors.title?.message}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormSelect
          label="Category"
          options={EXPENSE_CATEGORY_OPTIONS}
          registration={register("category")}
          error={errors.category?.message}
        />

        <FormSelect
          label="Expense Type"
          options={EXPENSE_TYPE_OPTIONS}
          registration={register("type")}
          error={errors.type?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormInput
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="135"
          registration={register("amount")}
          error={errors.amount?.message}
        />

        <FormInput
          label="Spent Date"
          type="date"
          registration={register("spentAt")}
          error={errors.spentAt?.message}
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
