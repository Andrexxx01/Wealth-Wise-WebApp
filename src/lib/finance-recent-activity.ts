import { buildRecentFinancialActivity } from "@/lib/finance-calculations";
import type { FinanceActivityItem } from "@/lib/finance-calculations";
import type { IncomeItem } from "@/types/income";
import type { ExpenseItem } from "@/types/expense";
import type { InvestmentRecentTransactionV2Item } from "@/types/investment-v2";

type ActivityItem = Omit<FinanceActivityItem, "type" | "amount"> & {
  type: FinanceActivityItem["type"] | "Buy" | "Sell" | "Open" | "Close";
  amount: number | null;
};

export function buildRecentActivityWithInvestments({
  incomeItems,
  expenseItems,
  investmentTransactions,
  convertAmount,
  limit = 5,
}: {
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
  investmentTransactions: InvestmentRecentTransactionV2Item[];
  convertAmount: (amount: number, currency: string) => number | null;
  limit?: number;
}): ActivityItem[] {
  const records: ActivityItem[] = buildRecentFinancialActivity({
    incomeItems,
    expenseItems,
    limit: incomeItems.length + expenseItems.length,
  });
  const labels = {
    BUY: "Buy",
    SELL: "Sell",
    OPEN: "Open",
    CLOSE: "Close",
  } as const;

  for (const item of investmentTransactions) {
    const cashFlow =
      item.type === "BUY" || item.type === "OPEN"
        ? -(item.grossAmount + item.feeAmount)
        : item.grossAmount - item.feeAmount;
    const amount = convertAmount(cashFlow, item.currencyCode);

    records.push({
      id: item.id,
      title: item.assetName,
      type: labels[item.type],
      amount: amount !== null && Number.isFinite(amount) ? amount : null,
      date: item.transactedAt,
    });
  }

  return records
    .filter((item) => Number.isFinite(Date.parse(item.date)))
    .sort(
      (a, b) =>
        Date.parse(b.date) - Date.parse(a.date) ||
        a.type.localeCompare(b.type) ||
        a.id.localeCompare(b.id),
    )
    .slice(0, Math.max(0, limit));
}
