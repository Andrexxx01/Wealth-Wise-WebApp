"use client";

import { useEffect } from "react";
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
import type { CreateInvestmentPayload } from "@/types/form-payload";
import type {
  CreateInvestmentFormValues,
  InvestmentItem,
} from "@/types/investment";

type EditInvestmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investment: InvestmentItem | null;
  onUpdateInvestment: (
    investmentId: string,
    payload: CreateInvestmentPayload,
  ) => void;
};

export default function EditInvestmentDialog({
  open,
  onOpenChange,
  investment,
  onUpdateInvestment,
}: EditInvestmentDialogProps) {
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
      investedAt: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!investment) return;

    reset({
      assetName: investment.assetName,
      category: investment.category,
      investedAmount: String(investment.investedAmount),
      currentValue: String(investment.currentValue),
      investedAt: investment.investedAt,
      notes: investment.notes ?? "",
    });
  }, [investment, reset]);

  function handleCloseDialog() {
    onOpenChange(false);
  }

  function onSubmit(values: CreateInvestmentFormValues) {
    if (!investment) return;

    const payload = transformInvestmentFormValues(values);

    onUpdateInvestment(investment.id, payload);
    onOpenChange(false);
  }

  return (
    <FormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Investment"
      description="Update your investment record details."
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          label="Asset Name"
          placeholder="Apple Stock"
          error={errors.assetName?.message}
          registration={register("assetName")}
        />

        <FormSelect
          label="Category"
          options={INVESTMENT_CATEGORY_OPTIONS}
          error={errors.category?.message}
          registration={register("category")}
        />

        <FormInput
          label="Invested Amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="1000"
          error={errors.investedAmount?.message}
          registration={register("investedAmount")}
        />

        <FormInput
          label="Current Value"
          type="number"
          min="0"
          step="0.01"
          placeholder="1200"
          error={errors.currentValue?.message}
          registration={register("currentValue")}
        />

        <FormInput
          label="Investment Date"
          type="date"
          error={errors.investedAt?.message}
          registration={register("investedAt")}
        />

        <FormTextarea
          label="Notes"
          placeholder="Optional notes"
          error={errors.notes?.message}
          registration={register("notes")}
          className="md:col-span-2"
        />
      </div>
    </FormDialogShell>
  );
}
