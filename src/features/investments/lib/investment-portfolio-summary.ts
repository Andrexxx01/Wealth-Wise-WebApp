import type {
  InvestmentPortfolioSummaryItem,
  InvestmentValuationItem,
} from "@/types/investment-v2";

import type { UserCurrency } from "@/types/user-subscription";

type CalculateInvestmentPortfolioSummaryInput = {
  valuations: InvestmentValuationItem[];

  displayCurrency: UserCurrency;

  usdToIdrRate: number;
};

function convertFeeToDisplayCurrency(
  valuation: InvestmentValuationItem,
  displayCurrency: UserCurrency,
  usdToIdrRate: number,
) {
  const transactionCurrency = valuation.transactionCurrencyCode;

  if (transactionCurrency === null) {
    return 0;
  }

  if (transactionCurrency === displayCurrency) {
    return valuation.totalFees;
  }

  if (transactionCurrency === "USD" && displayCurrency === "IDR") {
    return valuation.totalFees * usdToIdrRate;
  }

  if (transactionCurrency === "IDR" && displayCurrency === "USD") {
    return valuation.totalFees / usdToIdrRate;
  }

  return 0;
}

export function calculateInvestmentPortfolioSummary({
  valuations,
  displayCurrency,
  usdToIdrRate,
}: CalculateInvestmentPortfolioSummaryInput): InvestmentPortfolioSummaryItem {
  let valuedAssets = 0;

  let totalMarketValue = 0;
  let totalCostBasis = 0;

  let totalRealizedGainLoss = 0;
  let totalUnrealizedGainLoss = 0;

  let totalFeesInDisplayCurrency = 0;

  let openAssets = 0;
  let closedAssets = 0;

  for (const valuation of valuations) {
    if (valuation.isClosed) {
      closedAssets += 1;
    } else {
      openAssets += 1;
    }

    totalFeesInDisplayCurrency += convertFeeToDisplayCurrency(
      valuation,
      displayCurrency,
      usdToIdrRate,
    );

    if (valuation.valuationStatus !== "VALUED") {
      continue;
    }

    if (
      valuation.marketValue === null ||
      valuation.costBasisInDisplayCurrency === null ||
      valuation.realizedGainLossInDisplayCurrency === null ||
      valuation.unrealizedGainLoss === null
    ) {
      continue;
    }

    valuedAssets += 1;

    totalMarketValue += valuation.marketValue;

    totalCostBasis += valuation.costBasisInDisplayCurrency;

    totalRealizedGainLoss += valuation.realizedGainLossInDisplayCurrency;

    totalUnrealizedGainLoss += valuation.unrealizedGainLoss;
  }

  const totalGainLoss = totalRealizedGainLoss + totalUnrealizedGainLoss;

  const unrealizedReturnPercentage =
    totalCostBasis > 0
      ? (totalUnrealizedGainLoss / totalCostBasis) * 100
      : null;

  return {
    displayCurrency,

    totalAssets: valuations.length,

    valuedAssets,

    unvaluedAssets: valuations.length - valuedAssets,

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
