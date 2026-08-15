"use client";

import { useEffect, useState } from "react";
import { getExchangeRate } from "@/features/currency/api/exchange-rate-api";

export function useExchangeRate() {
  const [usdToIdrRate, setUsdToIdrRate] = useState<number | null>(null);
  const [isExchangeRateLoading, setIsExchangeRateLoading] = useState(true);
  const [exchangeRateError, setExchangeRateError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadExchangeRate() {
      try {
        setIsExchangeRateLoading(true);
        setExchangeRateError(null);

        const data = await getExchangeRate();

        if (isMounted) {
          setUsdToIdrRate(data.rate);
        }
      } catch (error) {
        console.error("Failed to load exchange rate:", error);

        if (isMounted) {
          setExchangeRateError("Failed to load exchange rate.");
        }
      } finally {
        if (isMounted) {
          setIsExchangeRateLoading(false);
        }
      }
    }

    loadExchangeRate();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    usdToIdrRate,
    isExchangeRateLoading,
    exchangeRateError,
  };
}
