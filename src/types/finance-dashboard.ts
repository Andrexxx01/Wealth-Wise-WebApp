import type { DashboardListItemTone } from "@/types/ui";

export type QuickSnapshotItem = {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  meta: string;
  tone?: DashboardListItemTone;
};

export type BuildQuickSnapshotItemsParams = {
  totalInvested: number;
  netGain: number;
  recurringIncome: number;
  essentialSpending: number;
};
