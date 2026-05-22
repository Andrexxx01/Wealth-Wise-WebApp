"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

  function onSubmit(values: CreateLoanFormValues) {
    console.log("Loan form values:", values);

    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Loan Title
                </label>

                <Input
                  placeholder="Laptop Installment"
                  className="h-12 rounded-2xl border-slate-200 shadow-none"
                  {...register("title")}
                />

                {errors.title ? (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Lender Name
                </label>

                <Input
                  placeholder="Tech Store"
                  className="h-12 rounded-2xl border-slate-200 shadow-none"
                  {...register("lenderName")}
                />

                {errors.lenderName ? (
                  <p className="text-sm text-red-600">
                    {errors.lenderName.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Category
              </label>

              <select
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
                {...register("category")}
              >
                <option value="PERSONAL">Personal Loan</option>
                <option value="CONSUMER">Consumer Loan</option>
                <option value="VEHICLE">Vehicle Loan</option>
                <option value="MORTGAGE">Mortgage</option>
                <option value="STUDENT">Student Loan</option>
                <option value="BUSINESS">Business Loan</option>
                <option value="OTHER">Other Loan</option>
              </select>

              {errors.category ? (
                <p className="text-sm text-red-600">
                  {errors.category.message}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Principal Amount
                </label>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="2000"
                  className="h-12 rounded-2xl border-slate-200 shadow-none"
                  {...register("principalAmount")}
                />

                {errors.principalAmount ? (
                  <p className="text-sm text-red-600">
                    {errors.principalAmount.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Remaining Balance
                </label>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="650"
                  className="h-12 rounded-2xl border-slate-200 shadow-none"
                  {...register("remainingBalance")}
                />

                {errors.remainingBalance ? (
                  <p className="text-sm text-red-600">
                    {errors.remainingBalance.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Monthly Payment
                </label>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="120"
                  className="h-12 rounded-2xl border-slate-200 shadow-none"
                  {...register("monthlyPayment")}
                />

                {errors.monthlyPayment ? (
                  <p className="text-sm text-red-600">
                    {errors.monthlyPayment.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Interest Rate
                </label>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="5.5"
                  className="h-12 rounded-2xl border-slate-200 shadow-none"
                  {...register("interestRate")}
                />

                {errors.interestRate ? (
                  <p className="text-sm text-red-600">
                    {errors.interestRate.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Due Date
              </label>

              <Input
                type="date"
                className="h-12 rounded-2xl border-slate-200 shadow-none"
                {...register("dueDate")}
              />

              {errors.dueDate ? (
                <p className="text-sm text-red-600">{errors.dueDate.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
