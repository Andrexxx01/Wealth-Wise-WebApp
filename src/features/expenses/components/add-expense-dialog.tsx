"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import ExpenseFormFields from "@/features/expenses/components/expense-form-fields";
import { createExpenseSchema } from "@/features/expenses/schemas/expense.schema";
import { transformExpenseFormValues } from "@/lib/form-transformers";
import type { AddExpenseDialogProps } from "@/types/finance-dialog";
import type { CreateExpenseFormValues } from "@/types/expense";
import { DEFAULT_EXPENSE_FORM_VALUES } from "@/constants/finance-form-defaults";

export default function AddExpenseDialog({
  open,
  onOpenChange,
  onCreateExpense,
}: AddExpenseDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateExpenseFormValues>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: DEFAULT_EXPENSE_FORM_VALUES,
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

  function onSubmit(values: CreateExpenseFormValues) {
    const payload = transformExpenseFormValues(values);

    onCreateExpense(payload);
    reset();
    onOpenChange(false);
  }

  return (
    <FormDialogShell
      open={open}
      onOpenChange={handleDialogOpenChange}
      title="Add Expense"
      description="Add a new expense record to keep your spending overview accurate."
      formProps={{
        onSubmit: handleSubmit(onSubmit),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Add Expense"
          isSubmitting={isSubmitting}
          onCancel={handleCloseDialog}
        />
      }
    >
      <ExpenseFormFields register={register} errors={errors} />
    </FormDialogShell>
  );
}
