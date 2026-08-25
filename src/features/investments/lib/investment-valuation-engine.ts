import { convertCurrency } from "@/lib/currency-conversion";

import type {
  InvestmentHoldingItem,
  InvestmentValuationItem,
} from "@/types/investment-v2";

import type { MarketPriceItem } from "@/types/market-price";

import type { UserCurrency } from "@/types/user-subscription";

type CalculateInvestmentValuationInput = {
  holding: InvestmentHoldingItem;

  marketPrice: MarketPriceItem | null;

  displayCurrency: UserCurrency;

  usdToIdrRate: number;

  marketPriceAsOf: string;
};

function isUserCurrency(currencyCode: string): currencyCode is UserCurrency {
  return currencyCode === "USD" || currencyCode === "IDR";
}

function createUnavailableValuation(
  holding: InvestmentHoldingItem,
  displayCurrency: UserCurrency,
  status:
    | "PRICE_UNAVAILABLE"
    | "UNSUPPORTED_VALUATION"
    | "UNSUPPORTED_CURRENCY",
): InvestmentValuationItem {
  return {
    ...holding,

    displayCurrency,

    marketPrice: null,
    marketPriceCurrencyCode: null,

    marketValue: null,

    costBasisInDisplayCurrency: null,

    realizedGainLossInDisplayCurrency: null,
    unrealizedGainLoss: null,
    unrealizedReturnPercentage: null,

    totalGainLoss: null,

    marketSource: null,
    marketPriceAsOf: null,

    valuationStatus: status,
  };
}

export function calculateInvestmentValuation({
  holding,
  marketPrice,
  displayCurrency,
  usdToIdrRate,
  marketPriceAsOf,
}: CalculateInvestmentValuationInput): InvestmentValuationItem {
  if (
    holding.positionKind !== "QUANTITY" ||
    holding.valuationType !== "MARKET_PRICE"
  ) {
    return createUnavailableValuation(
      holding,
      displayCurrency,
      "UNSUPPORTED_VALUATION",
    );
  }

  const transactionCurrencyCode = holding.transactionCurrencyCode;

  if (
    transactionCurrencyCode === null ||
    !isUserCurrency(transactionCurrencyCode)
  ) {
    return createUnavailableValuation(
      holding,
      displayCurrency,
      "UNSUPPORTED_CURRENCY",
    );
  }

  if (marketPrice === null) {
    return createUnavailableValuation(
      holding,
      displayCurrency,
      "PRICE_UNAVAILABLE",
    );
  }

  if (usdToIdrRate <= 0) {
    throw new Error("USD to IDR exchange rate must be greater than 0.");
  }

  const quantity = holding.quantity ?? 0;

  const marketValueInMarketCurrency = quantity * marketPrice.price;

  const marketValue = convertCurrency(
    marketValueInMarketCurrency,
    marketPrice.currency,
    displayCurrency,
    usdToIdrRate,
  );

  const costBasisInDisplayCurrency = convertCurrency(
    holding.remainingCostBasis,
    transactionCurrencyCode,
    displayCurrency,
    usdToIdrRate,
  );

  const realizedGainLossInDisplayCurrency = convertCurrency(
    holding.realizedGainLoss,
    transactionCurrencyCode,
    displayCurrency,
    usdToIdrRate,
  );

  const unrealizedGainLoss = marketValue - costBasisInDisplayCurrency;

  const unrealizedReturnPercentage =
    costBasisInDisplayCurrency > 0
      ? (unrealizedGainLoss / costBasisInDisplayCurrency) * 100
      : null;

  const totalGainLoss = realizedGainLossInDisplayCurrency + unrealizedGainLoss;

  return {
    ...holding,

    displayCurrency,

    marketPrice: marketPrice.price,
    marketPriceCurrencyCode: marketPrice.currency,

    marketValue,

    costBasisInDisplayCurrency,

    realizedGainLossInDisplayCurrency,
    unrealizedGainLoss,
    unrealizedReturnPercentage,

    totalGainLoss,

    marketSource: marketPrice.source,
    marketPriceAsOf,

    valuationStatus: "VALUED",
  };
}
