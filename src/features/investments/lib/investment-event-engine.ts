import type {
  InvestmentEventItem,
  InvestmentEventType,
} from "@/types/investment-v2";

const CASH_INCOME_EVENT_TYPES = new Set<InvestmentEventType>([
  "DIVIDEND",
  "INTEREST",
  "COUPON",
  "DISTRIBUTION",
]);

export type InvestmentEventSummary = {
  incomeCurrencyCode: string | null;

  totalGrossIncome: number;
  totalFees: number;
  totalTax: number;

  netRealizedIncome: number;

  dividendIncome: number;
  interestIncome: number;
  couponIncome: number;
  distributionIncome: number;

  cashIncomeEventCount: number;

  maturityRecorded: boolean;
  maturityOccurredAt: string | null;
};

function assertNonNegativeNumber(
  value: number,
  fieldName: string,
  eventId: string,
) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid ${fieldName} in investment event ${eventId}.`);
  }
}

function normalizeCurrencyCode(currencyCode: string) {
  return currencyCode.trim().toUpperCase();
}

export function calculateInvestmentEventSummary(
  events: InvestmentEventItem[],
): InvestmentEventSummary {
  let incomeCurrencyCode: string | null = null;

  let totalGrossIncome = 0;
  let totalFees = 0;
  let totalTax = 0;

  let dividendIncome = 0;
  let interestIncome = 0;
  let couponIncome = 0;
  let distributionIncome = 0;

  let cashIncomeEventCount = 0;

  let maturityRecorded = false;
  let maturityOccurredAt: string | null = null;

  for (const event of events) {
    // =====================================================
    // MATURITY
    // =====================================================

    if (event.type === "MATURITY") {
      maturityRecorded = true;

      if (
        maturityOccurredAt === null ||
        new Date(event.occurredAt).getTime() <
          new Date(maturityOccurredAt).getTime()
      ) {
        maturityOccurredAt = event.occurredAt;
      }

      continue;
    }

    // =====================================================
    // PRINCIPAL RETURN
    //
    // Principal return is not investment income.
    // Position changes remain controlled by transactions.
    // =====================================================

    if (event.type === "PRINCIPAL_RETURN") {
      continue;
    }

    // =====================================================
    // CASH INCOME EVENTS
    // =====================================================

    if (!CASH_INCOME_EVENT_TYPES.has(event.type)) {
      continue;
    }

    if (
      event.grossAmount === null ||
      !Number.isFinite(event.grossAmount) ||
      event.grossAmount <= 0
    ) {
      throw new Error(
        `Investment event ${event.id} requires a positive gross amount.`,
      );
    }

    assertNonNegativeNumber(event.feeAmount, "feeAmount", event.id);

    assertNonNegativeNumber(event.taxAmount, "taxAmount", event.id);

    if (!event.currencyCode) {
      throw new Error(`Investment event ${event.id} requires a currency code.`);
    }

    const eventCurrencyCode = normalizeCurrencyCode(event.currencyCode);

    if (!eventCurrencyCode) {
      throw new Error(
        `Investment event ${event.id} contains an empty currency code.`,
      );
    }

    // =====================================================
    // PREVENT MIXED EVENT CURRENCIES
    // =====================================================

    if (incomeCurrencyCode === null) {
      incomeCurrencyCode = eventCurrencyCode;
    } else if (incomeCurrencyCode !== eventCurrencyCode) {
      throw new Error(
        "Mixed investment event currencies are not supported yet.",
      );
    }

    // =====================================================
    // TOTALS
    // =====================================================

    totalGrossIncome += event.grossAmount;

    totalFees += event.feeAmount;

    totalTax += event.taxAmount;

    cashIncomeEventCount += 1;

    // =====================================================
    // BREAKDOWN BY EVENT TYPE
    // =====================================================

    if (event.type === "DIVIDEND") {
      dividendIncome += event.grossAmount;
    }

    if (event.type === "INTEREST") {
      interestIncome += event.grossAmount;
    }

    if (event.type === "COUPON") {
      couponIncome += event.grossAmount;
    }

    if (event.type === "DISTRIBUTION") {
      distributionIncome += event.grossAmount;
    }
  }

  const netRealizedIncome = totalGrossIncome - totalFees - totalTax;

  return {
    incomeCurrencyCode,

    totalGrossIncome,
    totalFees,
    totalTax,

    netRealizedIncome,

    dividendIncome,
    interestIncome,
    couponIncome,
    distributionIncome,

    cashIncomeEventCount,

    maturityRecorded,
    maturityOccurredAt,
  };
}
