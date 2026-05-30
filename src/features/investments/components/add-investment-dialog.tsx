"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import { INVESTMENT_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { createInvestmentSchema } from "@/features/investments/schemas/investment.schema";
import { transformInvestmentFormValues } from "@/lib/form-transformers";
import type { AddInvestmentDialogProps } from "@/types/finance-dialog";
import type { CreateInvestmentFormValues } from "@/types/investment";

const today = new Date().toISOString().slice(0, 10);

export default function AddInvestmentDialog({
  open,
  onOpenChange,
  onCreateInvestment,
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
    const payload = transformInvestmentFormValues(values);

    onCreateInvestment(payload);

    reset();
    onOpenChange(false);
  }

  return (
    <FormDialogShell
      open={open}
      onOpenChange={handleDialogOpenChange}
      title="Add Investment"
      description="Record stocks, crypto, mutual funds, bonds, gold, property, or any other assets you want to track."
      formProps={{
        onSubmit: handleSubmit(onSubmit),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Save Investment"
          isSubmitting={isSubmitting}
          onCancel={() => handleDialogOpenChange(false)}
        />
      }
    >
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
    </FormDialogShell>
  );
}
