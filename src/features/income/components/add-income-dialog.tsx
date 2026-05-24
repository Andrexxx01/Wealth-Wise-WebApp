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
