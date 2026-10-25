import type { FxRatesByCurrency } from "@/types/fx-rate";
import type { UserCurrency } from "@/types/user-subscription";

function normalizeCurrencyCode(currencyCode: string) {
  return currencyCode.trim().toUpperCase();
}

function getUsdRate(
  currencyCode: string,
  usdRates: FxRatesByCurrency,
): number | null {
  const normalizedCurrency = normalizeCurrencyCode(currencyCode);

  if (normalizedCurrency === "USD") {
    return 1;
  }

  const rate = usdRates[normalizedCurrency];

  return typeof rate === "number" && Number.isFinite(rate) && rate > 0
    ? rate
    : null;
}

/**
 * Convert an amount between arbitrary currencies using a USD-base rate table.
 *
 * Each rate represents:
 *
 *   1 USD = rate units of quote currency
 *
 * Therefore:
 *
 *   amount in FROM
 *   -> USD = amount / FROM rate
 *   -> TO  = USD amount * TO rate
 *
 * Returns null when either currency is not available in the rate table.
 */
export function convertCurrencyWithUsdRates({
  amount,
  fromCurrency,
  toCurrency,
  usdRates,
}: {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  usdRates: FxRatesByCurrency;
}): number | null {
  const normalizedFrom = normalizeCurrencyCode(fromCurrency);
  const normalizedTo = normalizeCurrencyCode(toCurrency);

  if (normalizedFrom === normalizedTo) {
    return amount;
  }

  const fromRate = getUsdRate(normalizedFrom, usdRates);
  const toRate = getUsdRate(normalizedTo, usdRates);

  if (fromRate === null || toRate === null) {
    return null;
  }

  return (amount / fromRate) * toRate;
}

export function convertCurrency(
  amount: number,
  fromCurrency: UserCurrency,
  toCurrency: UserCurrency,
  usdToIdrRate: number,
) {
  if (usdToIdrRate <= 0) {
    throw new Error("Exchange rate must be greater than 0.");
  }

  const converted = convertCurrencyWithUsdRates({
    amount,
    fromCurrency,
    toCurrency,
    usdRates: {
      USD: 1,
      IDR: usdToIdrRate,
    },
  });

  if (converted === null) {
    throw new Error(
      `Unsupported currency conversion: ${fromCurrency} to ${toCurrency}`,
    );
  }

  return converted;
}
