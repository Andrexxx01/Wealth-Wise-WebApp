import { formatCurrency } from "@/lib/formatters";
import type {
  BuildQuickSnapshotItemsParams,
  QuickSnapshotItem,
} from "@/types/finance-dashboard";

export function buildQuickSnapshotItems({
  totalInvested,
  netGain,
  recurringIncome,
  essentialSpending,
}: BuildQuickSnapshotItemsParams): QuickSnapshotItem[] {
  return [
    {
      id: "total-invested",
      title: "Total Invested",
      subtitle: "Capital deployed",
      value: formatCurrency(totalInvested),
      meta: `${netGain >= 0 ? "+" : ""}${formatCurrency(netGain)}`,
      tone: netGain >= 0 ? "positive" : "danger",
    },
    {
      id: "recurring-income",
      title: "Recurring Income",
      subtitle: "Salary & fixed sources",
      value: formatCurrency(recurringIncome),
      meta: "Monthly",
    },
    {
      id: "essential-spending",
      title: "Essential Spending",
      subtitle: "Needs & fixed costs",
      value: formatCurrency(essentialSpending),
      meta: "Needs",
    },
  ];
}
