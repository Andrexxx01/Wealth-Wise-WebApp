import type {
  FxRatesByCurrency,
  UsdFxRateTableData,
} from "@/types/fx-rate";

const FRANKFURTER_RATES_URL = "https://api.frankfurter.dev/v2/rates";
const FRANKFURTER_RATE_URL = "https://api.frankfurter.dev/v2/rate/USD";

const FX_RATE_REVALIDATE_SECONDS = 60 * 60 * 24;

export type UsdToIdrRateData = {
  base: "USD";
  quote: "IDR";
  rate: number;
};

type FrankfurterRateRow = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

function normalizeRequestedCurrencies(currencyCodes: string[]) {
  return [
    ...new Set(
      currencyCodes
        .map((currencyCode) => currencyCode.trim().toUpperCase())
        .filter(
          (currencyCode) =>
            currencyCode !== "USD" && /^[A-Z]{3}$/.test(currencyCode),
        ),
    ),
  ].sort();
}

function isValidRateRow(value: unknown): value is FrankfurterRateRow {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const row = value as Record<string, unknown>;

  return (
    typeof row.date === "string" &&
    typeof row.base === "string" &&
    typeof row.quote === "string" &&
    typeof row.rate === "number" &&
    Number.isFinite(row.rate) &&
    row.rate > 0
  );
}

async function fetchRateBatch(
  currencies: string[],
): Promise<FrankfurterRateRow[] | null> {
  if (currencies.length === 0) {
    return [];
  }

  const url = new URL(FRANKFURTER_RATES_URL);

  url.searchParams.set("base", "USD");
  url.searchParams.set("quotes", currencies.join(","));

  const response = await fetch(url, {
    next: {
      revalidate: FX_RATE_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    return null;
  }

  return data.filter(isValidRateRow);
}

async function fetchSingleRate(
  currency: string,
): Promise<FrankfurterRateRow | null> {
  try {
    const response = await fetch(
      `${FRANKFURTER_RATE_URL}/${encodeURIComponent(currency)}`,
      {
        next: {
          revalidate: FX_RATE_REVALIDATE_SECONDS,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();

    return isValidRateRow(data) ? data : null;
  } catch (error) {
    console.error(`Failed to load USD/${currency} exchange rate:`, error);

    return null;
  }
}

/**
 * Load latest USD-base FX rates for all requested currencies.
 *
 * Frankfurter supports a batched `quotes` request. If one unsupported
 * currency causes the batch to fail, fall back to individual requests so
 * supported currencies can still be valued and only the unsupported asset
 * is marked UNSUPPORTED_CURRENCY.
 */
export async function getUsdFxRates(
  currencyCodes: string[],
): Promise<UsdFxRateTableData> {
  const currencies = normalizeRequestedCurrencies(currencyCodes);

  const rates: FxRatesByCurrency = {
    USD: 1,
  };

  let rows = await fetchRateBatch(currencies);

  if (rows === null) {
    rows = (
      await Promise.all(currencies.map((currency) => fetchSingleRate(currency)))
    ).filter((row): row is FrankfurterRateRow => row !== null);
  }

  let asOf: string | null = null;

  for (const row of rows) {
    if (row.base.toUpperCase() !== "USD") {
      continue;
    }

    const quote = row.quote.trim().toUpperCase();

    rates[quote] = row.rate;

    if (asOf === null || row.date > asOf) {
      asOf = row.date;
    }
  }

  return {
    base: "USD",
    rates,
    asOf,
  };
}

export async function getUsdToIdrRate(): Promise<UsdToIdrRateData> {
  const table = await getUsdFxRates(["IDR"]);

  const rate = table.rates.IDR;

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("USD to IDR exchange rate is unavailable.");
  }

  return {
    base: "USD",
    quote: "IDR",
    rate,
  };
}
