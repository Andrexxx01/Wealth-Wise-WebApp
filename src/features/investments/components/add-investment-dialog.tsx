"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import InvestmentFormFields from "@/features/investments/components/investment-form-fields";
import { createInvestmentSchema } from "@/features/investments/schemas/investment.schema";
import { transformInvestmentFormValues } from "@/lib/form-transformers";
import type { AddInvestmentDialogProps } from "@/types/finance-dialog";
import type { CreateInvestmentFormValues } from "@/types/investment";

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
      investedAt: "",
      notes: "",
    },
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
      description="Add a new investment record to keep your portfolio overview accurate."
      formProps={{
        onSubmit: handleSubmit(onSubmit),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Add Investment"
          isSubmitting={isSubmitting}
          onCancel={handleCloseDialog}
        />
      }
    >
      <InvestmentFormFields register={register} errors={errors} />
    </FormDialogShell>
  );
}
