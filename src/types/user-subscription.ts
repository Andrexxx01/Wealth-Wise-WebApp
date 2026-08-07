export type UserPlan = "FREE" | "PRO";

export type UserCurrency = "USD" | "IDR";

export type SubscriptionStatus =
  | "NONE"
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELED"
  | "INCOMPLETE";
