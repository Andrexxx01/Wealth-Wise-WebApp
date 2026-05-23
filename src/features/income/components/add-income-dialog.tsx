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
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  function onSubmit(values: CreateIncomeFormValues) {
    console.log("Income form values:", values);

    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-[28px] border border-slate-200 p-0 shadow-2xl">
        <div className="px-8 py-8">
          <div className="mb-8">
            <DialogTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Add Income
            </DialogTitle>

            <DialogDescription className="mt-3 text-base leading-7 text-slate-500">
              Record salary, freelance payment, business income, or any other
              money you received.
            </DialogDescription>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Income Title
              </label>

              <Input
                placeholder="Primary Salary"
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
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Amount
                </label>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="5500"
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
                  Received Date
                </label>

                <Input
                  type="date"
                  className="h-12 rounded-2xl border-slate-200 shadow-none"
                  {...register("receivedAt")}
                />

                {errors.receivedAt ? (
                  <p className="text-sm text-red-600">
                    {errors.receivedAt.message}
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
                Save Income
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
