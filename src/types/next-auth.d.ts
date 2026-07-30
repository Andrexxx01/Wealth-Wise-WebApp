import type { DefaultSession } from "next-auth";
import type { SubscriptionStatus, UserPlan } from "@/types/user-subscription";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: UserPlan;
      subscriptionStatus: SubscriptionStatus;
    } & DefaultSession["user"];
  }
}

export {};
