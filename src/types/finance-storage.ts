import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { LoanItem } from "@/types/loan";

export type FinanceStorageData = {
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
  loanItems: LoanItem[];
};
