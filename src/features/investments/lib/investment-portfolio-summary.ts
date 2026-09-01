import { convertCurrency } from "@/lib/currency-conversion";

import type {
  InvestmentPortfolioSummaryItem,
  InvestmentValuationItem,
} from "@/types/investment-v2";

import type { UserCurrency } from "@/types/user-subscription";

type CalculateInvestmentPortfolioSummaryParams = {
  valuations: InvestmentValuationItem[];

  displayCurrency: UserCurrency;

  usdToIdrRate: number;
};

function isSupportedCurrency(
  currencyCode: string | null,
): currencyCode is UserCurrency {
  return currencyCode === "USD" || currencyCode === "IDR";
}

function convertHoldingAmount({
  amount,
  transactionCurrencyCode,
  displayCurrency,
  usdToIdrRate,
}: {
  amount: number;

  transactionCurrencyCode: string | null;

  displayCurrency: UserCurrency;

  usdToIdrRate: number;
}) {
  if (!isSupportedCurrency(transactionCurrencyCode)) {
    return null;
  }

  return convertCurrency(
    amount,
    transactionCurrencyCode,
    displayCurrency,
    usdToIdrRate,
  );
}

export function calculateInvestmentPortfolioSummary({
  valuations,
  displayCurrency,
  usdToIdrRate,
}: CalculateInvestmentPortfolioSummaryParams): InvestmentPortfolioSummaryItem {
  let valuedAssets = 0;

  let totalMarketValue = 0;

  /*
   * Cost basis seluruh holding yang
   * currency-nya dapat kita konversi.
   *
   * Cost basis TIDAK bergantung pada
   * tersedianya market price.
   */
  let totalCostBasis = 0;

  /*
   * Khusus denominator unrealized return.
   *
   * Hanya cost basis asset yang mempunyai
   * market valuation yang boleh masuk ke sini.
   */
  let valuedCostBasis = 0;

  let totalRealizedGainLoss = 0;

  let totalUnrealizedGainLoss = 0;

  let totalFeesInDisplayCurrency = 0;

  let openAssets = 0;

  let closedAssets = 0;

  for (const valuation of valuations) {
    // ===================================================
    // OPEN / CLOSED
    // ===================================================

    if (valuation.isClosed) {
      closedAssets += 1;
    } else {
      openAssets += 1;
    }

    // ===================================================
    // COST BASIS
    // ===================================================
    //
    // Jangan bergantung kepada valuationStatus.
    //
    // Kita sudah mengetahui cost basis dari transaction
    // history walaupun Coinbase/provider harga gagal.
    // ===================================================

    const convertedCostBasis = convertHoldingAmount({
      amount: valuation.remainingCostBasis,

      transactionCurrencyCode: valuation.transactionCurrencyCode,

      displayCurrency,

      usdToIdrRate,
    });

    if (convertedCostBasis !== null) {
      totalCostBasis += convertedCostBasis;
    }

    // ===================================================
    // REALIZED GAIN / LOSS
    // ===================================================
    //
    // Realized P/L juga tidak membutuhkan current
    // market price.
    // ===================================================

    const convertedRealizedGainLoss = convertHoldingAmount({
      amount: valuation.realizedGainLoss,

      transactionCurrencyCode: valuation.transactionCurrencyCode,

      displayCurrency,

      usdToIdrRate,
    });

    if (convertedRealizedGainLoss !== null) {
      totalRealizedGainLoss += convertedRealizedGainLoss;
    }

    // ===================================================
    // FEES
    // ===================================================

    const convertedFees = convertHoldingAmount({
      amount: valuation.totalFees,

      transactionCurrencyCode: valuation.transactionCurrencyCode,

      displayCurrency,

      usdToIdrRate,
    });

    if (convertedFees !== null) {
      totalFeesInDisplayCurrency += convertedFees;
    }

    // ===================================================
    // MARKET-DEPENDENT METRICS
    // ===================================================
    //
    // Market value dan unrealized P/L hanya boleh
    // dihitung kalau asset benar-benar VALUED.
    // ===================================================

    if (valuation.valuationStatus !== "VALUED") {
      continue;
    }

    valuedAssets += 1;

    if (valuation.marketValue !== null) {
      totalMarketValue += valuation.marketValue;
    }

    if (convertedCostBasis !== null) {
      valuedCostBasis += convertedCostBasis;
    }

    if (valuation.unrealizedGainLoss !== null) {
      totalUnrealizedGainLoss += valuation.unrealizedGainLoss;
    }
  }

  const totalAssets = valuations.length;

  const unvaluedAssets = totalAssets - valuedAssets;

  /*
   * Unrealized return harus memakai cost basis
   * dari holdings yang juga mempunyai valuation.
   *
   * Jangan memakai totalCostBasis semua asset,
   * karena asset tanpa market price tidak mempunyai
   * unrealized return yang dapat dihitung.
   */
  const unrealizedReturnPercentage =
    valuedCostBasis > 0
      ? (totalUnrealizedGainLoss / valuedCostBasis) * 100
      : null;

  /*
   * Ini bisa bersifat partial jika ada asset yang
   * belum mempunyai market valuation.
   *
   * UI akan memperjelas coverage-nya.
   */
  const totalGainLoss = totalRealizedGainLoss + totalUnrealizedGainLoss;

  return {
    displayCurrency,

    totalAssets,

    valuedAssets,

    unvaluedAssets,

    totalMarketValue,

    totalCostBasis,

    totalRealizedGainLoss,

    totalUnrealizedGainLoss,

    totalGainLoss,

    unrealizedReturnPercentage,

    totalFeesInDisplayCurrency,

    openAssets,

    closedAssets,
  };
}
