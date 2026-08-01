import type { SubscriptionStatus, UserPlan } from "@/types/user-subscription";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  plan: UserPlan;
  subscriptionStatus: SubscriptionStatus;
};
