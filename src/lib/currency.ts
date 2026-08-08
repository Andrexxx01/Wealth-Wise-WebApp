import type { UserCurrency } from "@/types/user-subscription";

export const SUPPORTED_CURRENCIES = ["USD", "IDR"] as const;

export function isSupportedCurrency(value: unknown): value is UserCurrency {
  return (
    typeof value === "string" &&
    SUPPORTED_CURRENCIES.includes(value as UserCurrency)
  );
}
