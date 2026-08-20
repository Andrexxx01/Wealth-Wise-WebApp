"use client";

import { useEffect, useMemo, useState } from "react";

import { getMarketPrices } from "@/features/investments/api/market-price-api";
import type { MarketPriceData, MarketPriceItem } from "@/types/market-price";

type MarketPriceMap = Record<string, MarketPriceItem | null>;

export function useMarketPrices(symbols: string[]) {
  const normalizedSymbols = useMemo(
    () =>
      [
        ...new Set(
          symbols.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean),
        ),
      ].sort(),
    [symbols],
  );

  const symbolsKey = normalizedSymbols.join(",");

  const [marketPriceData, setMarketPriceData] =
    useState<MarketPriceData | null>(null);

  const [isMarketPriceLoading, setIsMarketPriceLoading] = useState(false);

  const [marketPriceError, setMarketPriceError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadMarketPrices() {
      if (normalizedSymbols.length === 0) {
        setMarketPriceData({
          prices: {},
          quoteCurrency: "USD",
          asOf: new Date().toISOString(),
        });

        setMarketPriceError(null);
        setIsMarketPriceLoading(false);

        return;
      }

      try {
        setIsMarketPriceLoading(true);
        setMarketPriceError(null);

        const data = await getMarketPrices(normalizedSymbols);

        if (!isCancelled) {
          setMarketPriceData(data);
        }
      } catch (error) {
        console.error("Failed to load market prices:", error);

        if (!isCancelled) {
          setMarketPriceData(null);
          setMarketPriceError("Failed to load market prices.");
        }
      } finally {
        if (!isCancelled) {
          setIsMarketPriceLoading(false);
        }
      }
    }

    loadMarketPrices();

    return () => {
      isCancelled = true;
    };
  }, [symbolsKey]);

  const prices: MarketPriceMap = marketPriceData?.prices ?? {};

  return {
    prices,
    marketPriceData,
    isMarketPriceLoading,
    marketPriceError,
  };
}
