import type { FieldErrors, UseFormRegister } from "react-hook-form";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import { INVESTMENT_CATEGORY_OPTIONS } from "@/constants/finance-options";
import type { CreateInvestmentFormValues } from "@/types/investment";

type InvestmentFormFieldsProps = {
  register: UseFormRegister<CreateInvestmentFormValues>;
  errors: FieldErrors<CreateInvestmentFormValues>;
};

export default function InvestmentFormFields({
  register,
  errors,
}: InvestmentFormFieldsProps) {
  return (
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
  );
}
