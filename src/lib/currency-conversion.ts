import type { UserCurrency } from "@/types/user-subscription";

export function convertCurrency(
  amount: number,
  fromCurrency: UserCurrency,
  toCurrency: UserCurrency,
  usdToIdrRate: number,
) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (usdToIdrRate <= 0) {
    throw new Error("Exchange rate must be greater than 0.");
  }

  if (fromCurrency === "USD" && toCurrency === "IDR") {
    return amount * usdToIdrRate;
  }

  if (fromCurrency === "IDR" && toCurrency === "USD") {
    return amount / usdToIdrRate;
  }

  throw new Error(
    `Unsupported currency conversion: ${fromCurrency} to ${toCurrency}`,
  );
}
