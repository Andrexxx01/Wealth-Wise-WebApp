import type { DefaultSession } from "next-auth";
import type {
  SubscriptionStatus,
  UserCurrency,
  UserPlan,
} from "@/types/user-subscription";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: UserPlan;
      currency: UserCurrency;
      subscriptionStatus: SubscriptionStatus;
    } & DefaultSession["user"];
  }
}

export {};
