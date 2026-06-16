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
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_TYPE_OPTIONS,
} from "@/constants/finance-options";
import { createExpenseSchema } from "@/features/expenses/schemas/expense.schema";
import { transformExpenseFormValues } from "@/lib/form-transformers";
import type { CreateExpensePayload } from "@/types/form-payload";
import type { CreateExpenseFormValues, ExpenseItem } from "@/types/expense";

type EditExpenseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseItem | null;
  onUpdateExpense: (expenseId: string, payload: CreateExpensePayload) => void;
};

export default function EditExpenseDialog({
  open,
  onOpenChange,
  expense,
  onUpdateExpense,
}: EditExpenseDialogProps) {
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
      spentAt: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!expense) return;

    reset({
      title: expense.title,
      category: expense.category,
      type: expense.type,
      amount: String(expense.amount),
      spentAt: expense.spentAt,
      notes: expense.notes ?? "",
    });
  }, [expense, reset]);

  function handleCloseDialog() {
    onOpenChange(false);
  }

  function onSubmit(values: CreateExpenseFormValues) {
    if (!expense) return;

    const payload = transformExpenseFormValues(values);

    onUpdateExpense(expense.id, payload);
    onOpenChange(false);
  }

  return (
    <FormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Expense"
      description="Update your expense record details."
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
          label="Expense Title"
          placeholder="Groceries"
          error={errors.title?.message}
          registration={register("title")}
        />

        <FormInput
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="120"
          error={errors.amount?.message}
          registration={register("amount")}
        />

        <FormSelect
          label="Category"
          options={EXPENSE_CATEGORY_OPTIONS}
          error={errors.category?.message}
          registration={register("category")}
        />

        <FormSelect
          label="Type"
          options={EXPENSE_TYPE_OPTIONS}
          error={errors.type?.message}
          registration={register("type")}
        />

        <FormInput
          label="Spent Date"
          type="date"
          error={errors.spentAt?.message}
          registration={register("spentAt")}
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
