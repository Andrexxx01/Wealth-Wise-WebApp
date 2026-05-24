"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { LOAN_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { createLoanSchema } from "@/features/loans/schemas/loan.schemas";
import type { CreateLoanFormValues } from "@/types/loan";

type AddLoanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddLoanDialog({
  open,
  onOpenChange,
}: AddLoanDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLoanFormValues>({
    resolver: zodResolver(createLoanSchema),
    defaultValues: {
      title: "",
      lenderName: "",
      category: "PERSONAL",
      principalAmount: "",
      remainingBalance: "",
      monthlyPayment: "",
      interestRate: "",
      dueDate: "",
    },
  });

  function handleDialogOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }

    onOpenChange(nextOpen);
  }

  function onSubmit(values: CreateLoanFormValues) {
    console.log("Loan form values:", values);

    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-[28px] border border-slate-200 p-0 shadow-2xl">
        <div className="px-8 py-8">
          <div className="mb-8">
            <DialogTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Add Loan
            </DialogTitle>

            <DialogDescription className="mt-3 text-base leading-7 text-slate-500">
              Record loan balances, monthly obligations, due dates, and
              repayment details so your debt stays visible and under control.
            </DialogDescription>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormInput
                label="Loan Title"
                placeholder="Laptop Installment"
                registration={register("title")}
                error={errors.title?.message}
              />

              <FormInput
                label="Lender Name"
                placeholder="Tech Store"
                registration={register("lenderName")}
                error={errors.lenderName?.message}
              />
            </div>

            <FormSelect
              label="Category"
              options={LOAN_CATEGORY_OPTIONS}
              registration={register("category")}
              error={errors.category?.message}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormInput
                label="Principal Amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="2000"
                registration={register("principalAmount")}
                error={errors.principalAmount?.message}
              />

              <FormInput
                label="Remaining Balance"
                type="number"
                min="0"
                step="0.01"
                placeholder="650"
                registration={register("remainingBalance")}
                error={errors.remainingBalance?.message}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormInput
                label="Monthly Payment"
                type="number"
                min="0"
                step="0.01"
                placeholder="120"
                registration={register("monthlyPayment")}
                error={errors.monthlyPayment?.message}
              />

              <FormInput
                label="Interest Rate"
                type="number"
                min="0"
                step="0.01"
                placeholder="5.5"
                registration={register("interestRate")}
                error={errors.interestRate?.message}
              />
            </div>

            <FormInput
              label="Due Date"
              type="date"
              registration={register("dueDate")}
              error={errors.dueDate?.message}
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
                Save Loan
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
