import type { UserCurrency } from "@/types/user-subscription";

type CurrencyConfig = {
  locale: string;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
};

const currencyConfigs: Record<UserCurrency, CurrencyConfig> = {
  USD: {
    locale: "en-US",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },

  IDR: {
    locale: "id-ID",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
};

export function formatCurrency(value: number, currency: UserCurrency = "USD") {
  const config = currencyConfigs[currency];

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    minimumFractionDigits: config.minimumFractionDigits,
    maximumFractionDigits: config.maximumFractionDigits,
  }).format(value);
}

export function formatCompactCurrency(
  value: number,
  currency: UserCurrency = "USD",
) {
  const config = currencyConfigs[currency];

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function formatPercentage(value: number, fractionDigits = 1) {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
