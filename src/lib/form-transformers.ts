import type { CreateExpenseFormValues } from "@/types/expense";
import type { CreateIncomeFormValues } from "@/types/income";
import type { CreateLoanFormValues } from "@/types/loan";
import type {
  CreateExpensePayload,
  CreateIncomePayload,
  CreateLoanPayload,
} from "@/types/form-payload";

function normalizeOptionalText(value?: string) {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : null;
}

function toNumber(value: string) {
  return Number(value);
}

export function transformIncomeFormValues(
  values: CreateIncomeFormValues,
): CreateIncomePayload {
  return {
    title: values.title.trim(),
    category: values.category,
    amount: toNumber(values.amount),
    currency: values.currency,
    receivedAt: values.receivedAt,
    frequency: values.frequency,
    notes: normalizeOptionalText(values.notes),
  };
}

export function transformExpenseFormValues(
  values: CreateExpenseFormValues,
): CreateExpensePayload {
  return {
    title: values.title.trim(),
    category: values.category,
    type: values.type,
    amount: toNumber(values.amount),
    currency: values.currency,
    spentAt: values.spentAt,
    notes: normalizeOptionalText(values.notes),
  };
}

export function transformLoanFormValues(
  values: CreateLoanFormValues,
): CreateLoanPayload {
  return {
    title: values.title.trim(),
    lenderName: values.lenderName.trim(),
    category: values.category,
    principalAmount: toNumber(values.principalAmount),
    remainingBalance: toNumber(values.remainingBalance),
    monthlyPayment: toNumber(values.monthlyPayment),
    currency: values.currency,
    interestRate: values.interestRate ? toNumber(values.interestRate) : null,
    dueDate: values.dueDate ? values.dueDate : null,
  };
}
