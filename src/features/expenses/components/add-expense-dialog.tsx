"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormSelect from "@/components/form/form-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    if (!nextOpen) reset();
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
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Expense Title
              </label>

              <Input
                placeholder="Supermarket"
                className="h-12 rounded-2xl border-slate-200 shadow-none"
                {...register("title")}
              />

              {errors.title ? (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              ) : null}
            </div>

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
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Amount
                </label>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="135"
                  className="h-12 rounded-2xl border-slate-200 shadow-none"
                  {...register("amount")}
                />

                {errors.amount ? (
                  <p className="text-sm text-red-600">
                    {errors.amount.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Spent Date
                </label>

                <Input
                  type="date"
                  className="h-12 rounded-2xl border-slate-200 shadow-none"
                  {...register("spentAt")}
                />

                {errors.spentAt ? (
                  <p className="text-sm text-red-600">
                    {errors.spentAt.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Notes
              </label>

              <Textarea
                placeholder="Optional note..."
                className="min-h-24 rounded-2xl border-slate-200 shadow-none"
                {...register("notes")}
              />

              {errors.notes ? (
                <p className="text-sm text-red-600">{errors.notes.message}</p>
              ) : null}
            </div>

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
