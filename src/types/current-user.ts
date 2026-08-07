import type {
  SubscriptionStatus,
  UserCurrency,
  UserPlan,
} from "@/types/user-subscription";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  plan: UserPlan;
  currency: UserCurrency;
  subscriptionStatus: SubscriptionStatus;
};
