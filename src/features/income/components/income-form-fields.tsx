import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import {
  INCOME_CATEGORY_OPTIONS,
  INCOME_FREQUENCY_OPTIONS,
} from "@/constants/finance-options";
import type { IncomeFormFieldsProps } from "@/types/finance-form-fields";

export default function IncomeFormFields({
  register,
  errors,
}: IncomeFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormInput
        label="Income Title"
        placeholder="Monthly salary"
        error={errors.title?.message}
        registration={register("title")}
      />

      <FormInput
        label="Amount"
        type="number"
        min="0"
        step="0.01"
        placeholder="5000"
        error={errors.amount?.message}
        registration={register("amount")}
      />

      <FormSelect
        label="Category"
        options={INCOME_CATEGORY_OPTIONS}
        error={errors.category?.message}
        registration={register("category")}
      />

      <FormSelect
        label="Frequency"
        options={INCOME_FREQUENCY_OPTIONS}
        error={errors.frequency?.message}
        registration={register("frequency")}
      />

      <FormInput
        label="Received Date"
        type="date"
        error={errors.receivedAt?.message}
        registration={register("receivedAt")}
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
