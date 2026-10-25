import { convertCurrencyWithUsdRates } from "@/lib/currency-conversion";

import type { FxRatesByCurrency } from "@/types/fx-rate";

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

  fxRates: FxRatesByCurrency;

  marketPriceAsOf: string;
};

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

function getDepositAccrualValuationFields(
  depositAccrualSummary: DepositAccrualSummary | null,
) {
  if (depositAccrualSummary === null) {
    return {
      depositAccrualStartAt: null,

      depositAccrualEndAt: null,

      depositGrossAccruedInterest: null,

      depositRealizedGrossInterest: null,

      depositUnpaidAccruedInterest: null,

      depositAccruedValue: null,

      depositRealizedInterestExceedsAccrual: null,
    };
  }

  return {
    depositAccrualStartAt: depositAccrualSummary.valuationStartAt,

    depositAccrualEndAt: depositAccrualSummary.accrualEndAt,

    depositGrossAccruedInterest: depositAccrualSummary.grossAccruedInterest,

    depositRealizedGrossInterest: depositAccrualSummary.realizedGrossInterest,

    depositUnpaidAccruedInterest: depositAccrualSummary.unpaidAccruedInterest,

    depositAccruedValue: depositAccrualSummary.accruedValue,

    depositRealizedInterestExceedsAccrual:
      depositAccrualSummary.realizedInterestExceedsAccrual,
  };
}

function createUnavailableValuation({
  holding,
  eventSummary,
  depositAccrualSummary,
  displayCurrency,
  status,
  costBasisInDisplayCurrency,
  realizedGainLossInDisplayCurrency,
}: {
  holding: InvestmentHoldingItem;

  eventSummary: InvestmentEventSummary;

  depositAccrualSummary: DepositAccrualSummary | null;

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
    ...getDepositAccrualValuationFields(depositAccrualSummary),
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
  fxRates,
  marketPriceAsOf,
}: CalculateInvestmentValuationInput): InvestmentValuationItem {
  // =====================================================
  // TRANSACTION CURRENCY
  // =====================================================

  const transactionCurrencyCode = holding.transactionCurrencyCode;

  if (transactionCurrencyCode === null) {
    return createUnavailableValuation({
      holding,

      eventSummary,

      depositAccrualSummary,

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

  const costBasisInDisplayCurrency = convertCurrencyWithUsdRates({
    amount: holding.remainingCostBasis,
    fromCurrency: transactionCurrencyCode,
    toCurrency: displayCurrency,
    usdRates: fxRates,
  });

  const realizedGainLossInDisplayCurrency = convertCurrencyWithUsdRates({
    amount: holding.realizedGainLoss,
    fromCurrency: transactionCurrencyCode,
    toCurrency: displayCurrency,
    usdRates: fxRates,
  });

  if (
    costBasisInDisplayCurrency === null ||
    realizedGainLossInDisplayCurrency === null
  ) {
    return createUnavailableValuation({
      holding,
      eventSummary,
      depositAccrualSummary,
      displayCurrency,
      status: "UNSUPPORTED_CURRENCY",
      costBasisInDisplayCurrency: null,
      realizedGainLossInDisplayCurrency: null,
    });
  }

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

    const marketValue = convertCurrencyWithUsdRates({
      amount: depositAccrualSummary.accruedValue,
      fromCurrency: transactionCurrencyCode,
      toCurrency: displayCurrency,
      usdRates: fxRates,
    });

    if (marketValue === null) {
      return createUnavailableValuation({
        holding,
        eventSummary,
        depositAccrualSummary,
        displayCurrency,
        status: "UNSUPPORTED_CURRENCY",
        costBasisInDisplayCurrency,
        realizedGainLossInDisplayCurrency,
      });
    }

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
      ...getDepositAccrualValuationFields(depositAccrualSummary),
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
  // CLOSED QUANTITY POSITION
  // =====================================================
  //
  // Posisi quantity yang sudah sepenuhnya ditutup
  // tidak lagi membutuhkan current market valuation.
  //
  // Current market value = 0
  // Unrealized gain/loss = 0
  // Total capital gain/loss = realized gain/loss
  // =====================================================

  if (holding.positionKind === "QUANTITY" && holding.isClosed) {
    return {
      ...holding,

      ...getInvestmentEventValuationFields(eventSummary),

      ...getDepositAccrualValuationFields(null),

      displayCurrency,

      marketPrice: null,
      marketPriceCurrencyCode: null,

      marketValue: 0,

      costBasisInDisplayCurrency,

      realizedGainLossInDisplayCurrency,

      unrealizedGainLoss: 0,
      unrealizedReturnPercentage: null,

      totalGainLoss: realizedGainLossInDisplayCurrency,

      marketSource: null,
      marketPriceAsOf: null,

      valuationStatus: "VALUED",
    };
  }

  // =====================================================
  // MANUAL QUANTITY VALUATION
  // =====================================================
  //
  // Manual valuation stores a current price per pricing unit
  // on the asset itself. This is useful for instruments such
  // as bonds when an automatic market-data provider is not yet
  // available.
  // =====================================================

  if (
    holding.positionKind === "QUANTITY" &&
    holding.valuationType === "MANUAL"
  ) {
    if (holding.manualPrice === null) {
      return createUnavailableValuation({
        holding,
        eventSummary,
        depositAccrualSummary,
        displayCurrency,
        status: "PRICE_UNAVAILABLE",
        costBasisInDisplayCurrency,
        realizedGainLossInDisplayCurrency,
      });
    }

    const manualPriceCurrencyCode =
      holding.marketCurrencyCode ?? transactionCurrencyCode;

    const quantity = holding.quantity ?? 0;

    const marketValueInManualCurrency = quantity * holding.manualPrice;

    const marketValue = convertCurrencyWithUsdRates({
      amount: marketValueInManualCurrency,
      fromCurrency: manualPriceCurrencyCode,
      toCurrency: displayCurrency,
      usdRates: fxRates,
    });

    if (marketValue === null) {
      return createUnavailableValuation({
        holding,
        eventSummary,
        depositAccrualSummary,
        displayCurrency,
        status: "UNSUPPORTED_CURRENCY",
        costBasisInDisplayCurrency,
        realizedGainLossInDisplayCurrency,
      });
    }

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
      ...getDepositAccrualValuationFields(null),

      displayCurrency,

      marketPrice: holding.manualPrice,
      marketPriceCurrencyCode: manualPriceCurrencyCode,

      marketValue,

      costBasisInDisplayCurrency,
      realizedGainLossInDisplayCurrency,

      unrealizedGainLoss,
      unrealizedReturnPercentage,
      totalGainLoss,

      marketSource: "manual",
      marketPriceAsOf: holding.manualPriceUpdatedAt,

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

      depositAccrualSummary,

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

      depositAccrualSummary,

      displayCurrency,

      status: "PRICE_UNAVAILABLE",

      costBasisInDisplayCurrency,

      realizedGainLossInDisplayCurrency,
    });
  }

  // =====================================================
  // MARKET PRICE CURRENCY
  // =====================================================

  // =====================================================
  // MARKET VALUE
  // =====================================================

  const quantity = holding.quantity ?? 0;

  const marketValueInMarketCurrency = quantity * marketPrice.price;

  const marketValue = convertCurrencyWithUsdRates({
    amount: marketValueInMarketCurrency,
    fromCurrency: marketPrice.currency,
    toCurrency: displayCurrency,
    usdRates: fxRates,
  });

  if (marketValue === null) {
    return createUnavailableValuation({
      holding,
      eventSummary,
      depositAccrualSummary,
      displayCurrency,
      status: "UNSUPPORTED_CURRENCY",
      costBasisInDisplayCurrency,
      realizedGainLossInDisplayCurrency,
    });
  }

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

    ...getDepositAccrualValuationFields(null),

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

    marketPriceAsOf: marketPrice.asOf ?? marketPriceAsOf,

    valuationStatus: "VALUED",
  };
}
