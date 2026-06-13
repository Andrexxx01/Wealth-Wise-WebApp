import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { InvestmentItem } from "@/types/investment";
import type { LoanItem } from "@/types/loan";

export type FinanceStorageData = {
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
  investmentItems: InvestmentItem[];
  loanItems: LoanItem[];
};
