"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-[28px] border border-slate-200 p-0 shadow-2xl">
        <div className="px-8 py-8">
          <div className="mb-8">
            <DialogTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Add Expense
            </DialogTitle>

            <DialogDescription className="mt-3 text-base leading-7 text-slate-500">
              Record daily spending, bills, subscriptions, and other expenses so
              your financial overview stays accurate.
            </DialogDescription>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                className="h-12 rounded-2xl border-slate-300 px-6 font-semibold"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
              >
                Save Expense
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
