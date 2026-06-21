import type { ExpenseItem, CreateExpenseFormValues } from "@/types/expense";
import type { IncomeItem, CreateIncomeFormValues } from "@/types/income";
import type {
  CreateInvestmentFormValues,
  InvestmentItem,
} from "@/types/investment";
import type { CreateLoanFormValues, LoanItem } from "@/types/loan";

export function mapIncomeItemToFormValues(
  income: IncomeItem,
): CreateIncomeFormValues {
  return {
    title: income.title,
    category: income.category,
    amount: String(income.amount),
    receivedAt: income.receivedAt,
    frequency: income.frequency,
    notes: income.notes ?? "",
  };
}

export function mapExpenseItemToFormValues(
  expense: ExpenseItem,
): CreateExpenseFormValues {
  return {
    title: expense.title,
    category: expense.category,
    type: expense.type,
    amount: String(expense.amount),
    spentAt: expense.spentAt,
    notes: expense.notes ?? "",
  };
}

export function mapInvestmentItemToFormValues(
  investment: InvestmentItem,
): CreateInvestmentFormValues {
  return {
    assetName: investment.assetName,
    category: investment.category,
    investedAmount: String(investment.investedAmount),
    currentValue: String(investment.currentValue),
    investedAt: investment.investedAt,
    notes: investment.notes ?? "",
  };
}

export function mapLoanItemToFormValues(loan: LoanItem): CreateLoanFormValues {
  return {
    title: loan.title,
    lenderName: loan.lenderName,
    category: loan.category,
    principalAmount: String(loan.principalAmount),
    remainingBalance: String(loan.remainingBalance),
    monthlyPayment: String(loan.monthlyPayment),
    interestRate: loan.interestRate === null ? "" : String(loan.interestRate),
    dueDate: loan.dueDate ?? "",
  };
}
