import type { SubscriptionStatus, UserPlan } from "@/types/user-subscription";

export type FinanceUsageResource = "income" | "expense" | "investment" | "loan";

export type FinanceUsageItem = {
  resource: FinanceUsageResource;
  label: string;
  currentCount: number;
  limit: number | null;
  remaining: number | null;
  isUnlimited: boolean;
  hasReachedLimit: boolean;
};

export type AccountUsageData = {
  plan: UserPlan;
  subscriptionStatus: SubscriptionStatus;
  totalRecords: number;
  limitPerResource: number | null;
  usage: {
    income: FinanceUsageItem;
    expense: FinanceUsageItem;
    investment: FinanceUsageItem;
    loan: FinanceUsageItem;
  };
};
