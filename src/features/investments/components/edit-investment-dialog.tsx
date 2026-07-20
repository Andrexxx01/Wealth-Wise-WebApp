"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";
import InvestmentFormFields from "@/features/investments/components/investment-form-fields";
import { createInvestmentSchema } from "@/features/investments/schemas/investment.schema";
import { transformInvestmentFormValues } from "@/lib/form-transformers";
import type { EditInvestmentDialogProps } from "@/types/finance-dialog";
import type { CreateInvestmentFormValues } from "@/types/investment";
import { DEFAULT_INVESTMENT_FORM_VALUES } from "@/constants/finance-form-defaults";
import { mapInvestmentItemToFormValues } from "@/lib/finance-form-mappers";

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
    defaultValues: DEFAULT_INVESTMENT_FORM_VALUES,
  });

  useEffect(() => {
    if (!investment) return;

    reset(mapInvestmentItemToFormValues(investment));
  }, [investment, reset]);

  function handleCloseDialog() {
    onOpenChange(false);
  }

  async function onSubmit(values: CreateInvestmentFormValues) {
    if (!investment) return;

    try {
      const payload = transformInvestmentFormValues(values);

      await onUpdateInvestment(investment.id, payload);

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update investment:", error);
    }
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
      <InvestmentFormFields register={register} errors={errors} />
    </FormDialogShell>
  );
}
