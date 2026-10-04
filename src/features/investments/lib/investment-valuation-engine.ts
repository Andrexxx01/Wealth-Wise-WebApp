import { convertCurrency } from "@/lib/currency-conversion";

import type {
  InvestmentHoldingItem,
  InvestmentValuationItem,
} from "@/types/investment-v2";

import type { MarketPriceItem } from "@/types/market-price";

import type { UserCurrency } from "@/types/user-subscription";

import type { InvestmentEventSummary } from "@/features/investments/lib/investment-event-engine";
import type { DepositAccrualSummary } from "@/features/investments/lib/investment-deposit-accrual-engine";

type CalculateInvestmentValuationInput = {
  holding: InvestmentHoldingItem;

  eventSummary: InvestmentEventSummary;
  depositAccrualSummary: DepositAccrualSummary | null;
  marketPrice: MarketPriceItem | null;

  displayCurrency: UserCurrency;

  usdToIdrRate: number;

  marketPriceAsOf: string;
};

function isUserCurrency(currencyCode: string): currencyCode is UserCurrency {
  return currencyCode === "USD" || currencyCode === "IDR";
}

function getInvestmentEventValuationFields(
  eventSummary: InvestmentEventSummary,
) {
  return {
    eventIncomeCurrencyCode: eventSummary.incomeCurrencyCode,

    grossRealizedIncome: eventSummary.totalGrossIncome,

    eventFees: eventSummary.totalFees,

    eventTax: eventSummary.totalTax,

    netRealizedIncome: eventSummary.netRealizedIncome,

    cashIncomeEventCount: eventSummary.cashIncomeEventCount,

    maturityRecorded: eventSummary.maturityRecorded,

    maturityOccurredAt: eventSummary.maturityOccurredAt,
  };
}

function createUnavailableValuation({
  holding,
  eventSummary,
  displayCurrency,
  status,
  costBasisInDisplayCurrency,
  realizedGainLossInDisplayCurrency,
}: {
  holding: InvestmentHoldingItem;

  eventSummary: InvestmentEventSummary;

  displayCurrency: UserCurrency;

  status:
    | "PRICE_UNAVAILABLE"
    | "UNSUPPORTED_VALUATION"
    | "UNSUPPORTED_CURRENCY";

  costBasisInDisplayCurrency: number | null;

  realizedGainLossInDisplayCurrency: number | null;
}): InvestmentValuationItem {
  return {
    ...holding,

    ...getInvestmentEventValuationFields(eventSummary),

    displayCurrency,

    marketPrice: null,
    marketPriceCurrencyCode: null,

    marketValue: null,

    /*
     * Historical metrics tetap dapat diketahui
     * meskipun current market valuation belum
     * tersedia.
     */
    costBasisInDisplayCurrency,

    realizedGainLossInDisplayCurrency,

    /*
     * Unrealized metrics membutuhkan current
     * valuation, sehingga tetap null.
     */
    unrealizedGainLoss: null,
    unrealizedReturnPercentage: null,

    /*
     * Total gain/loss tidak boleh dibuat hanya
     * dari realized gain/loss karena unrealized
     * component belum diketahui.
     */
    totalGainLoss: null,

    marketSource: null,
    marketPriceAsOf: null,

    valuationStatus: status,
  };
}

export function calculateInvestmentValuation({
  holding,
  eventSummary,
  depositAccrualSummary,
  marketPrice,
  displayCurrency,
  usdToIdrRate,
  marketPriceAsOf,
}: CalculateInvestmentValuationInput): InvestmentValuationItem {
  // =====================================================
  // FX VALIDATION
  // =====================================================

  if (!Number.isFinite(usdToIdrRate) || usdToIdrRate <= 0) {
    throw new Error("USD to IDR exchange rate must be greater than 0.");
  }

  // =====================================================
  // TRANSACTION CURRENCY
  // =====================================================

  const transactionCurrencyCode = holding.transactionCurrencyCode;

  if (
    transactionCurrencyCode === null ||
    !isUserCurrency(transactionCurrencyCode)
  ) {
    return createUnavailableValuation({
      holding,

      eventSummary,

      displayCurrency,

      status: "UNSUPPORTED_CURRENCY",

      costBasisInDisplayCurrency: null,

      realizedGainLossInDisplayCurrency: null,
    });
  }

  // =====================================================
  // HISTORICAL METRICS
  // =====================================================
  //
  // Cost basis dan realized gain/loss berasal dari
  // transaction history.
  //
  // Mereka TIDAK bergantung pada current market price.
  // =====================================================

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

  // =====================================================
  // DEPOSIT ACCRUAL VALUATION
  // =====================================================

  if (
    holding.instrumentType === "DEPOSIT" &&
    holding.positionKind === "PRINCIPAL" &&
    holding.valuationType === "ACCRUAL"
  ) {
    if (depositAccrualSummary === null) {
      throw new Error(
        `Deposit asset ${holding.assetId} is missing its accrual summary.`,
      );
    }

    const marketValue = convertCurrency(
      depositAccrualSummary.accruedValue,
      transactionCurrencyCode,
      displayCurrency,
      usdToIdrRate,
    );

    /*
     * Untuk deposito:
     *
     * market/accrued value
     * =
     * principal
     * + bunga yang masih accrued dan belum dibayar.
     *
     * Cost basis tetap principal.
     */
    const unrealizedGainLoss = marketValue - costBasisInDisplayCurrency;

    const unrealizedReturnPercentage =
      costBasisInDisplayCurrency > 0
        ? (unrealizedGainLoss / costBasisInDisplayCurrency) * 100
        : null;

    const totalGainLoss =
      realizedGainLossInDisplayCurrency + unrealizedGainLoss;

    return {
      ...holding,

      ...getInvestmentEventValuationFields(eventSummary),

      displayCurrency,

      /*
       * Deposit tidak mempunyai quoted market price
       * seperti crypto/saham.
       */
      marketPrice: null,
      marketPriceCurrencyCode: null,

      marketValue,

      costBasisInDisplayCurrency,

      realizedGainLossInDisplayCurrency,

      unrealizedGainLoss,

      unrealizedReturnPercentage,

      totalGainLoss,

      marketSource: null,

      marketPriceAsOf,

      valuationStatus: "VALUED",
    };
  }

  // =====================================================
  // VALUATION METHOD SUPPORT
  // =====================================================

  if (
    holding.positionKind !== "QUANTITY" ||
    holding.valuationType !== "MARKET_PRICE"
  ) {
    return createUnavailableValuation({
      holding,

      eventSummary,

      displayCurrency,

      status: "UNSUPPORTED_VALUATION",

      costBasisInDisplayCurrency,

      realizedGainLossInDisplayCurrency,
    });
  }

  // =====================================================
  // MARKET PRICE AVAILABILITY
  // =====================================================

  if (marketPrice === null) {
    return createUnavailableValuation({
      holding,

      eventSummary,

      displayCurrency,

      status: "PRICE_UNAVAILABLE",

      costBasisInDisplayCurrency,

      realizedGainLossInDisplayCurrency,
    });
  }

  // =====================================================
  // MARKET VALUE
  // =====================================================

  const quantity = holding.quantity ?? 0;

  const marketValueInMarketCurrency = quantity * marketPrice.price;

  const marketValue = convertCurrency(
    marketValueInMarketCurrency,
    marketPrice.currency,
    displayCurrency,
    usdToIdrRate,
  );

  // =====================================================
  // UNREALIZED GAIN / LOSS
  // =====================================================

  const unrealizedGainLoss = marketValue - costBasisInDisplayCurrency;

  const unrealizedReturnPercentage =
    costBasisInDisplayCurrency > 0
      ? (unrealizedGainLoss / costBasisInDisplayCurrency) * 100
      : null;

  // =====================================================
  // TOTAL CAPITAL GAIN / LOSS
  // =====================================================

  const totalGainLoss = realizedGainLossInDisplayCurrency + unrealizedGainLoss;

  return {
    ...holding,

    ...getInvestmentEventValuationFields(eventSummary),

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
