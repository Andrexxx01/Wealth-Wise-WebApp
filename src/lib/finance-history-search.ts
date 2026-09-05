import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { InvestmentItem } from "@/types/investment";
import type { LoanItem } from "@/types/loan";
import type { InvestmentRecentTransactionV2Item } from "@/types/investment-v2";

import {
  formatExpenseCategory,
  formatExpenseType,
  formatIncomeCategory,
  formatIncomeFrequency,
  formatInvestmentCategory,
  formatInvestmentV2Category,
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

function formatInvestmentTransactionType(
  type: "BUY" | "SELL" | "OPEN" | "CLOSE",
) {
  switch (type) {
    case "BUY":
      return "Buy";

    case "SELL":
      return "Sell";

    case "OPEN":
      return "Open";

    case "CLOSE":
      return "Close";
  }
}

function formatInvestmentTransactionSearchAmount(
  amount: number,
  currencyCode: string,
) {
  if (currencyCode === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  if (currencyCode === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  return `${currencyCode} ${amount}`;
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
  return doesSearchableTextMatch(
    [
      item.assetName,

      item.symbol ?? "",

      formatInvestmentCategory(item.category),

      formatCurrency(item.investedAmount, item.currency),

      item.quantity ?? "",

      item.feeAmount,

      formatDate(item.investedAt),

      item.investedAmount,
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

export function doesInvestmentTransactionV2MatchSearch(
  item: InvestmentRecentTransactionV2Item,
  searchQuery: string,
) {
  return doesSearchableTextMatch(
    [
      item.assetName,

      item.assetSymbol ?? "",

      formatInvestmentV2Category(item.category),

      formatInvestmentTransactionType(item.type),

      item.type,

      item.currencyCode,

      formatInvestmentTransactionSearchAmount(
        item.grossAmount,
        item.currencyCode,
      ),

      formatInvestmentTransactionSearchAmount(
        item.feeAmount,
        item.currencyCode,
      ),

      item.quantity ?? "",

      item.grossAmount,

      item.feeAmount,

      formatDate(item.transactedAt),

      item.notes ?? "",
    ],

    searchQuery,
  );
}
