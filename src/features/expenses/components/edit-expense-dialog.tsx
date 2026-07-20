"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import ExpenseFormFields from "@/features/expenses/components/expense-form-fields";
import { createExpenseSchema } from "@/features/expenses/schemas/expense.schema";
import { transformExpenseFormValues } from "@/lib/form-transformers";
import type { EditExpenseDialogProps } from "@/types/finance-dialog";
import type { CreateExpenseFormValues } from "@/types/expense";
import { DEFAULT_EXPENSE_FORM_VALUES } from "@/constants/finance-form-defaults";
import { mapExpenseItemToFormValues } from "@/lib/finance-form-mappers";

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
    defaultValues: DEFAULT_EXPENSE_FORM_VALUES,
  });

  useEffect(() => {
    if (!expense) return;

    reset(mapExpenseItemToFormValues(expense));
  }, [expense, reset]);

  function handleCloseDialog() {
    onOpenChange(false);
  }

  async function onSubmit(values: CreateExpenseFormValues) {
    if (!expense) return;

    try {
      const payload = transformExpenseFormValues(values);

      await onUpdateExpense(expense.id, payload);

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
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
      <ExpenseFormFields register={register} errors={errors} />
    </FormDialogShell>
  );
}
