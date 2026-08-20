"use client";

import { useMemo } from "react";

import { useConvertedFinanceItems } from "@/features/finance/hooks/use-converted-finance-items";
import { useMarketPrices } from "@/features/investments/hooks/use-market-prices";
import { convertCurrency } from "@/lib/currency-conversion";

export function useInvestmentMarketSummary() {
  const {
    investmentItems,
    displayCurrency,
    usdToIdrRate,
    isCurrencyConversionReady,
  } = useConvertedFinanceItems();

  const marketSymbols = useMemo(
    () => [
      ...new Set(
        investmentItems
          .filter(
            (item) =>
              item.category === "CRYPTO" &&
              item.symbol &&
              item.quantity !== null &&
              item.quantity > 0,
          )
          .map((item) => item.symbol!)
          .map((symbol) => symbol.trim().toUpperCase()),
      ),
    ],
    [investmentItems],
  );

  const { prices, marketPriceData, isMarketPriceLoading, marketPriceError } =
    useMarketPrices(marketSymbols);

  const result = useMemo(() => {
    let portfolioValue = 0;

    let pricedInvestmentCount = 0;

    let isPortfolioValuationComplete = true;

    for (const item of investmentItems) {
      /*
       * MVP:
       * automatic market pricing currently supports
       * CRYPTO investments only.
       */
      if (item.category !== "CRYPTO") {
        isPortfolioValuationComplete = false;
        continue;
      }

      if (!item.symbol || item.quantity === null || item.quantity <= 0) {
        isPortfolioValuationComplete = false;
        continue;
      }

      const normalizedSymbol = item.symbol.trim().toUpperCase();

      const marketPrice = prices[normalizedSymbol];

      if (!marketPrice) {
        isPortfolioValuationComplete = false;
        continue;
      }

      const marketValueUsd = item.quantity * marketPrice.price;

      let marketValueInDisplayCurrency: number;

      if (displayCurrency === "USD") {
        marketValueInDisplayCurrency = marketValueUsd;
      } else {
        if (usdToIdrRate === null || usdToIdrRate <= 0) {
          isPortfolioValuationComplete = false;
          continue;
        }

        marketValueInDisplayCurrency = convertCurrency(
          marketValueUsd,
          "USD",
          displayCurrency,
          usdToIdrRate,
        );
      }

      portfolioValue += marketValueInDisplayCurrency;

      pricedInvestmentCount += 1;
    }

    /*
     * No investment records means there is nothing
     * missing from the valuation.
     */
    if (investmentItems.length === 0) {
      isPortfolioValuationComplete = true;
    }

    return {
      portfolioValue,
      pricedInvestmentCount,
      isPortfolioValuationComplete,
    };
  }, [investmentItems, prices, displayCurrency, usdToIdrRate]);

  const isPortfolioValuationReady =
    isCurrencyConversionReady &&
    !isMarketPriceLoading &&
    !marketPriceError &&
    result.isPortfolioValuationComplete;

  return {
    ...result,

    displayCurrency,

    marketPriceAsOf: marketPriceData?.asOf ?? null,

    isPortfolioValuationReady,
    isMarketPriceLoading,
    marketPriceError,
  };
}
