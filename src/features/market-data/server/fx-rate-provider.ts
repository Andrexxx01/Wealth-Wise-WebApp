const FRANKFURTER_USD_IDR_URL = "https://api.frankfurter.dev/v2/rate/USD/IDR";

const FX_RATE_REVALIDATE_SECONDS = 60 * 60 * 24;

export type UsdToIdrRateData = {
  base: "USD";
  quote: "IDR";
  rate: number;
};

export async function getUsdToIdrRate(): Promise<UsdToIdrRateData> {
  const response = await fetch(FRANKFURTER_USD_IDR_URL, {
    next: {
      revalidate: FX_RATE_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Frankfurter API returned status ${response.status}`);
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("rate" in data) ||
    typeof data.rate !== "number" ||
    !Number.isFinite(data.rate) ||
    data.rate <= 0
  ) {
    throw new Error("Invalid exchange rate response.");
  }

  return {
    base: "USD",
    quote: "IDR",
    rate: data.rate,
  };
}
