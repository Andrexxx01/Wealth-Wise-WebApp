"use client";

import { useMemo } from "react";

import { useCurrentUser } from "@/features/auth/components/current-user-provider";
import { useFinance } from "@/features/finance/components/finance-provider";
import { useExchangeRate } from "@/features/currency/hooks/use-exchange-rate";
import { useMarketPrices } from "@/features/investments/hooks/use-market-prices";

import { convertCurrency } from "@/lib/currency-conversion";

export function useInvestmentMarketSummary() {
  /*
   * Gunakan RAW investment records.
   *
   * Market valuation membutuhkan:
   * - category
   * - symbol
   * - quantity
   *
   * Data tersebut tidak perlu dikonversi FX terlebih dahulu.
   */
  const { investmentItems } = useFinance();

  const { currentUser } = useCurrentUser();

  const { usdToIdrRate, isExchangeRateLoading, exchangeRateError } =
    useExchangeRate();

  const displayCurrency = currentUser.currency;

  /*
   * Ambil unique market symbols dari investment
   * yang bisa kita price otomatis.
   *
   * MVP saat ini:
   * CRYPTO only.
   */
  const marketSymbols = useMemo(
    () => [
      ...new Set(
        investmentItems
          .filter(
            (item) =>
              item.category === "CRYPTO" &&
              item.quantity > 0,
          )
          .map((item) => item.symbol.trim().toUpperCase()),
      ),
    ],
    [investmentItems],
  );

  const { prices, marketPriceData, isMarketPriceLoading, marketPriceError } =
    useMarketPrices(marketSymbols);

  const result = useMemo(() => {
    let portfolioValue = 0;

    let pricedInvestmentCount = 0;
    let unpricedInvestmentCount = 0;

    let isPortfolioValuationComplete = true;

    for (const item of investmentItems) {
      /*
       * Automatic pricing MVP hanya mendukung CRYPTO.
       */
      if (item.category !== "CRYPTO") {
        isPortfolioValuationComplete = false;
        unpricedInvestmentCount += 1;

        continue;
      }

      /*
       * Crypto membutuhkan symbol + quantity.
       */
      if (item.quantity <= 0) {
        isPortfolioValuationComplete = false;
        unpricedInvestmentCount += 1;
        continue;
      }

      const normalizedSymbol = item.symbol.trim().toUpperCase();

      const marketPrice = prices[normalizedSymbol];

      /*
       * Market API belum mempunyai price untuk asset ini.
       */
      if (!marketPrice) {
        isPortfolioValuationComplete = false;
        unpricedInvestmentCount += 1;

        continue;
      }

      /*
       * Coinbase memberikan price dalam USD.
       */
      const marketValueUsd = item.quantity * marketPrice.price;

      let marketValueInDisplayCurrency: number;

      /*
       * Kalau user memakai USD:
       *
       * tidak perlu FX conversion.
       */
      if (displayCurrency === "USD") {
        marketValueInDisplayCurrency = marketValueUsd;
      } else {
        /*
         * IDR membutuhkan USD → IDR rate.
         */
        if (usdToIdrRate === null || usdToIdrRate <= 0) {
          isPortfolioValuationComplete = false;
          unpricedInvestmentCount += 1;

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
     * Kalau belum ada investment,
     * tidak ada valuation yang hilang.
     */
    if (investmentItems.length === 0) {
      isPortfolioValuationComplete = true;
    }

    return {
      portfolioValue,
      pricedInvestmentCount,
      unpricedInvestmentCount,
      isPortfolioValuationComplete,
    };
  }, [investmentItems, prices, displayCurrency, usdToIdrRate]);

  /*
   * FX hanya wajib kalau display currency = IDR.
   *
   * Untuk USD, Coinbase sudah memberikan BTC/USD.
   */
  const isRequiredFxReady =
    displayCurrency === "USD" ||
    (!isExchangeRateLoading &&
      !exchangeRateError &&
      usdToIdrRate !== null &&
      usdToIdrRate > 0);

  const isPortfolioValuationReady =
    !isMarketPriceLoading &&
    !marketPriceError &&
    isRequiredFxReady &&
    result.isPortfolioValuationComplete;

  console.log("INVESTMENT MARKET DEBUG", {
    investmentItems: investmentItems.map((item) => ({
      assetName: item.assetName,
      category: item.category,
      symbol: item.symbol,
      quantity: item.quantity,
      investedAmount: item.investedAmount,
      feeAmount: item.feeAmount,
    })),

    marketSymbols,

    prices,

    displayCurrency,
    usdToIdrRate,

    portfolioValue: result.portfolioValue,
    pricedInvestmentCount: result.pricedInvestmentCount,
    unpricedInvestmentCount: result.unpricedInvestmentCount,
    isPortfolioValuationComplete: result.isPortfolioValuationComplete,

    isRequiredFxReady,

    isMarketPriceLoading,
    marketPriceError,

    isPortfolioValuationReady,
  });

  return {
    ...result,

    displayCurrency,

    marketPriceAsOf: marketPriceData?.asOf ?? null,

    isPortfolioValuationReady,

    isMarketPriceLoading,
    marketPriceError,
  };
}
