import type { ExchangeRateData } from "@/types/exchange-rate";

type ExchangeRateResponse = {
  data: ExchangeRateData;
};

export async function getExchangeRate(): Promise<ExchangeRateData> {
  const response = await fetch("/api/exchange-rates");

  if (!response.ok) {
    throw new Error("Failed to load exchange rate.");
  }

  const result: ExchangeRateResponse = await response.json();

  if (!result.data.rate || result.data.rate <= 0) {
    throw new Error("Invalid exchange rate.");
  }

  return result.data;
}
