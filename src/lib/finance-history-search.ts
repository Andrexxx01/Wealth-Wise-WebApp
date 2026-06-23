import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { InvestmentItem } from "@/types/investment";
import type { LoanItem } from "@/types/loan";
import {
  formatExpenseCategory,
  formatExpenseType,
  formatIncomeCategory,
  formatIncomeFrequency,
  formatInvestmentCategory,
  formatLoanCategory,
  formatLoanStatus,
} from "@/lib/finance-labels";
import { formatCurrency, formatDate } from "@/lib/formatters";

type SearchableValue = string | number | null | undefined;

function doesSearchableTextMatch(
  values: SearchableValue[],
  searchQuery: string,
) {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  if (!normalizedSearchQuery) {
    return true;
  }

  const searchableText = values
    .map((value) =>
      value === null || value === undefined ? "" : String(value),
    )
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedSearchQuery);
}

export function doesIncomeMatchSearch(item: IncomeItem, searchQuery: string) {
  return doesSearchableTextMatch(
    [
      item.title,
      formatIncomeCategory(item.category),
      formatIncomeFrequency(item.frequency),
      formatCurrency(item.amount),
      formatDate(item.receivedAt),
      item.amount,
    ],
    searchQuery,
  );
}

export function doesExpenseMatchSearch(item: ExpenseItem, searchQuery: string) {
  return doesSearchableTextMatch(
    [
      item.title,
      formatExpenseCategory(item.category),
      formatExpenseType(item.type),
      formatCurrency(item.amount),
      formatDate(item.spentAt),
      item.amount,
    ],
    searchQuery,
  );
}

export function doesInvestmentMatchSearch(
  item: InvestmentItem,
  searchQuery: string,
) {
  const gainAmount = item.currentValue - item.investedAmount;

  return doesSearchableTextMatch(
    [
      item.assetName,
      formatInvestmentCategory(item.category),
      formatCurrency(item.investedAmount),
      formatCurrency(item.currentValue),
      formatCurrency(gainAmount),
      formatDate(item.investedAt),
      item.investedAmount,
      item.currentValue,
      gainAmount,
    ],
    searchQuery,
  );
}

export function doesLoanMatchSearch(item: LoanItem, searchQuery: string) {
  return doesSearchableTextMatch(
    [
      item.title,
      item.lenderName,
      formatLoanCategory(item.category),
      formatLoanStatus(item.status),
      formatCurrency(item.principalAmount),
      formatCurrency(item.remainingBalance),
      formatCurrency(item.monthlyPayment),
      item.interestRate === null ? "" : `${item.interestRate}%`,
      item.dueDate ? formatDate(item.dueDate) : "No due date",
      item.principalAmount,
      item.remainingBalance,
      item.monthlyPayment,
      item.interestRate,
    ],
    searchQuery,
  );
}
