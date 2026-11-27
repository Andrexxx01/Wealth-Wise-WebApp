import type { ThemePreference } from "@/types/user-preferences";
import type { DefaultSession } from "next-auth";
import type {
  SubscriptionStatus,
  UserCurrency,
  UserPlan,
} from "@/types/user-subscription";

declare module "next-auth" {
  interface User {
    credentialVersion?: string;
  }

  interface Session {
    user: {
      id: string;
      plan: UserPlan;
      currency: UserCurrency;
      theme: ThemePreference;
      subscriptionStatus: SubscriptionStatus;
    } & DefaultSession["user"];
  }
}

export {};
