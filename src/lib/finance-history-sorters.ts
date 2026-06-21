import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { InvestmentItem } from "@/types/investment";
import type { LoanItem } from "@/types/loan";

function sortByDateDescending<TItem>(
  items: TItem[],
  getDateValue: (item: TItem) => string,
) {
  return [...items].sort((currentItem, nextItem) => {
    return (
      new Date(getDateValue(nextItem)).getTime() -
      new Date(getDateValue(currentItem)).getTime()
    );
  });
}

export function sortIncomeHistoryItems(items: IncomeItem[]) {
  return sortByDateDescending(items, (item) => item.receivedAt);
}

export function sortExpenseHistoryItems(items: ExpenseItem[]) {
  return sortByDateDescending(items, (item) => item.spentAt);
}

export function sortInvestmentHistoryItems(items: InvestmentItem[]) {
  return sortByDateDescending(items, (item) => item.investedAt);
}

export function sortLoanHistoryItems(items: LoanItem[]) {
  return sortByDateDescending(items, (item) => item.dueDate ?? item.createdAt);
}
