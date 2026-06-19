import type { FieldErrors, UseFormRegister } from "react-hook-form";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import { LOAN_CATEGORY_OPTIONS } from "@/constants/finance-options";
import type { CreateLoanFormValues } from "@/types/loan";

type LoanFormFieldsProps = {
  register: UseFormRegister<CreateLoanFormValues>;
  errors: FieldErrors<CreateLoanFormValues>;
};

export default function LoanFormFields({
  register,
  errors,
}: LoanFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormInput
        label="Loan Title"
        placeholder="Car loan"
        error={errors.title?.message}
        registration={register("title")}
      />

      <FormInput
        label="Lender Name"
        placeholder="Bank name"
        error={errors.lenderName?.message}
        registration={register("lenderName")}
      />

      <FormSelect
        label="Category"
        options={LOAN_CATEGORY_OPTIONS}
        error={errors.category?.message}
        registration={register("category")}
      />

      <FormInput
        label="Principal Amount"
        type="number"
        min="0"
        step="0.01"
        placeholder="20000"
        error={errors.principalAmount?.message}
        registration={register("principalAmount")}
      />

      <FormInput
        label="Remaining Balance"
        type="number"
        min="0"
        step="0.01"
        placeholder="15000"
        error={errors.remainingBalance?.message}
        registration={register("remainingBalance")}
      />

      <FormInput
        label="Monthly Payment"
        type="number"
        min="0"
        step="0.01"
        placeholder="500"
        error={errors.monthlyPayment?.message}
        registration={register("monthlyPayment")}
      />

      <FormInput
        label="Interest Rate"
        type="number"
        min="0"
        step="0.01"
        placeholder="5.5"
        error={errors.interestRate?.message}
        registration={register("interestRate")}
      />

      <FormInput
        label="Due Date"
        type="date"
        error={errors.dueDate?.message}
        registration={register("dueDate")}
      />
    </div>
  );
}
