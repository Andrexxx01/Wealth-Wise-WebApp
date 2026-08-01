import type { SubscriptionStatus, UserPlan } from "@/types/user-subscription";

export type ProfileDropdownProps = {
  userName: string;
  userEmail: string;
  userImage: string | null;
  userPlan: UserPlan;
  subscriptionStatus: SubscriptionStatus;
};
