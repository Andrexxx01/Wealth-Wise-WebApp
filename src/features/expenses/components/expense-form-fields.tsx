import type { FieldErrors, UseFormRegister } from "react-hook-form";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import {
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_TYPE_OPTIONS,
} from "@/constants/finance-options";
import type { CreateExpenseFormValues } from "@/types/expense";

type ExpenseFormFieldsProps = {
  register: UseFormRegister<CreateExpenseFormValues>;
  errors: FieldErrors<CreateExpenseFormValues>;
};

export default function ExpenseFormFields({
  register,
  errors,
}: ExpenseFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormInput
        label="Expense Title"
        placeholder="Groceries"
        error={errors.title?.message}
        registration={register("title")}
      />

      <FormInput
        label="Amount"
        type="number"
        min="0"
        step="0.01"
        placeholder="120"
        error={errors.amount?.message}
        registration={register("amount")}
      />

      <FormSelect
        label="Category"
        options={EXPENSE_CATEGORY_OPTIONS}
        error={errors.category?.message}
        registration={register("category")}
      />

      <FormSelect
        label="Type"
        options={EXPENSE_TYPE_OPTIONS}
        error={errors.type?.message}
        registration={register("type")}
      />

      <FormInput
        label="Spent Date"
        type="date"
        error={errors.spentAt?.message}
        registration={register("spentAt")}
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
