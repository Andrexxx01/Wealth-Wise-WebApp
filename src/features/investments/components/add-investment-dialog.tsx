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
import { INVESTMENT_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { createInvestmentSchema } from "@/features/investments/schemas/investment.schema";
import type { CreateInvestmentFormValues } from "@/types/investment";

type AddInvestmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const today = new Date().toISOString().slice(0, 10);

export default function AddInvestmentDialog({
  open,
  onOpenChange,
}: AddInvestmentDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateInvestmentFormValues>({
    resolver: zodResolver(createInvestmentSchema),
    defaultValues: {
      assetName: "",
      category: "STOCK",
      investedAmount: "",
      currentValue: "",
      investedAt: today,
      notes: "",
    },
  });

  function handleDialogOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }

    onOpenChange(nextOpen);
  }

  function onSubmit(values: CreateInvestmentFormValues) {
    console.log("Investment form values:", values);

    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-[28px] border border-slate-200 p-0 shadow-2xl">
        <div className="px-8 py-8">
          <div className="mb-8">
            <DialogTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Add Investment
            </DialogTitle>

            <DialogDescription className="mt-3 text-base leading-7 text-slate-500">
              Record stocks, crypto, mutual funds, bonds, gold, property, or any
              other assets you want to track.
            </DialogDescription>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              label="Asset Name"
              placeholder="Apple Inc."
              registration={register("assetName")}
              error={errors.assetName?.message}
            />

            <FormSelect
              label="Category"
              options={INVESTMENT_CATEGORY_OPTIONS}
              registration={register("category")}
              error={errors.category?.message}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormInput
                label="Invested Amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="2800"
                registration={register("investedAmount")}
                error={errors.investedAmount?.message}
              />

              <FormInput
                label="Current Value"
                type="number"
                min="0"
                step="0.01"
                placeholder="3100"
                registration={register("currentValue")}
                error={errors.currentValue?.message}
              />
            </div>

            <FormInput
              label="Investment Date"
              type="date"
              registration={register("investedAt")}
              error={errors.investedAt?.message}
            />

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
                Save Investment
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
