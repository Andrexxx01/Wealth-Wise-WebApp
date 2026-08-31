import type {
  CreateInvestmentAssetV2Payload,
  CreateInvestmentTransactionV2Payload,
} from "@/types/investment-v2";

import type {
  CreateInvestmentAssetV2FormValues,
  CreateInvestmentTransactionV2FormValues,
} from "@/types/investment-v2-form";

function normalizeOptionalText(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
}

function normalizeOptionalUppercaseText(value: string) {
  const normalizedValue = value.trim().toUpperCase();

  return normalizedValue ? normalizedValue : null;
}

function normalizeRequiredUppercaseText(value: string) {
  return value.trim().toUpperCase();
}

function toNumber(value: string) {
  return Number(value);
}

function toOptionalNumber(value: string) {
  if (value.trim() === "") {
    return null;
  }

  return Number(value);
}

function toFeeNumber(value: string) {
  if (value.trim() === "") {
    return 0;
  }

  return Number(value);
}

function dateInputToIsoDateTime(value: string) {
  const trimmedValue = value.trim();

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(trimmedValue)) {
    throw new Error(`Invalid date input: ${value}`);
  }

  const date = new Date(`${trimmedValue}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== trimmedValue
  ) {
    throw new Error(`Invalid calendar date: ${value}`);
  }

  return date.toISOString();
}

function optionalDateInputToIsoDateTime(value: string) {
  if (value.trim() === "") {
    return null;
  }

  return dateInputToIsoDateTime(value);
}

export function transformInvestmentAssetV2FormValues(
  values: CreateInvestmentAssetV2FormValues,
): CreateInvestmentAssetV2Payload {
  const symbol = normalizeOptionalUppercaseText(values.symbol);

  const transactionCurrencyCode = normalizeRequiredUppercaseText(
    values.currencyCode,
  );

  // =====================================================
  // ASSET METADATA
  // =====================================================

  let exchange: string | null = null;

  let isin: string | null = null;

  let issuer: string | null = null;

  let underlyingIndex: string | null = null;

  let unit: string | null = null;

  let pricingUnit: string | null = null;

  let marketCurrencyCode: string | null = normalizeOptionalUppercaseText(
    values.marketCurrencyCode,
  );

  let annualInterestRate: number | null = null;

  let couponRate: number | null = null;

  let faceValue: number | null = null;

  let maturityDate: string | null = null;

  // =====================================================
  // CRYPTO
  // =====================================================

  if (values.category === "CRYPTO") {
    exchange = normalizeOptionalText(values.exchange);

    unit = symbol;

    pricingUnit = symbol;

    marketCurrencyCode = marketCurrencyCode ?? "USD";
  }

  // =====================================================
  // STOCK
  // =====================================================

  if (values.category === "STOCK") {
    exchange = normalizeOptionalText(values.exchange);

    unit = "SHARE";
    pricingUnit = "SHARE";
  }

  // =====================================================
  // DEPOSIT
  // =====================================================

  if (values.category === "DEPOSIT") {
    issuer = normalizeOptionalText(values.issuer);

    annualInterestRate = toOptionalNumber(values.annualInterestRate);

    maturityDate = optionalDateInputToIsoDateTime(values.maturityDate);

    /*
     * Deposit is principal-based.
     * Its natural currency is the
     * transaction/principal currency.
     */
    marketCurrencyCode = transactionCurrencyCode;
  }

  // =====================================================
  // INDEX
  // =====================================================

  if (values.category === "INDEX") {
    underlyingIndex = normalizeOptionalText(values.underlyingIndex);

    if (values.instrumentType === "ETF") {
      exchange = normalizeOptionalText(values.exchange);

      unit = "SHARE";
      pricingUnit = "SHARE";
    }

    if (values.instrumentType === "INDEX_FUND") {
      unit = "UNIT";
      pricingUnit = "UNIT";
    }
  }

  // =====================================================
  // BOND
  // =====================================================

  if (values.category === "BOND") {
    issuer = normalizeOptionalText(values.issuer);

    isin = normalizeOptionalUppercaseText(values.isin);

    couponRate = toOptionalNumber(values.couponRate);

    faceValue = toOptionalNumber(values.faceValue);

    maturityDate = optionalDateInputToIsoDateTime(values.maturityDate);

    unit = "UNIT";
    pricingUnit = "UNIT";
  }

  // =====================================================
  // MUTUAL FUND
  // =====================================================

  if (values.category === "MUTUAL_FUND") {
    issuer = normalizeOptionalText(values.issuer);

    unit = "UNIT";
    pricingUnit = "UNIT";
  }

  // =====================================================
  // FOREX HOLDING
  // =====================================================

  if (values.category === "FOREX") {
    /*
     * Example:
     *
     * symbol = USD
     * quantity = 1,000 USD
     * marketCurrencyCode = IDR
     *
     * The FX price means:
     * IDR per 1 USD.
     */

    unit = symbol;
    pricingUnit = symbol;
  }

  // =====================================================
  // COMMODITY
  // =====================================================

  if (values.category === "COMMODITY") {
    if (values.instrumentType === "ETF") {
      exchange = normalizeOptionalText(values.exchange);

      unit = "SHARE";
      pricingUnit = "SHARE";
    }

    if (values.instrumentType === "PHYSICAL_COMMODITY") {
      unit = normalizeOptionalUppercaseText(values.unit);

      pricingUnit = normalizeOptionalUppercaseText(values.pricingUnit);
    }
  }

  // =====================================================
  // INITIAL TRANSACTION
  // =====================================================

  const quantity =
    values.initialTransactionType === "BUY" ? toNumber(values.quantity) : null;

  return {
    name: values.name.trim(),

    category: values.category,

    instrumentType: values.instrumentType,

    valuationType: values.valuationType,

    symbol,

    exchange,
    isin,
    issuer,
    underlyingIndex,

    unit,
    pricingUnit,

    marketCurrencyCode,

    annualInterestRate,
    couponRate,
    faceValue,
    maturityDate,

    notes: normalizeOptionalText(values.assetNotes),

    initialTransaction: {
      type: values.initialTransactionType,

      quantity,

      grossAmount: toNumber(values.grossAmount),

      feeAmount: toFeeNumber(values.feeAmount),

      currencyCode: transactionCurrencyCode,

      transactedAt: dateInputToIsoDateTime(values.transactedAt),

      notes: normalizeOptionalText(values.transactionNotes),
    },
  };
}

export function transformInvestmentTransactionV2FormValues(
  values: CreateInvestmentTransactionV2FormValues,
): CreateInvestmentTransactionV2Payload {
  const isQuantityTransaction = values.type === "BUY" || values.type === "SELL";

  return {
    type: values.type,

    quantity: isQuantityTransaction ? toNumber(values.quantity) : null,

    grossAmount: toNumber(values.grossAmount),

    feeAmount: toFeeNumber(values.feeAmount),

    currencyCode: normalizeRequiredUppercaseText(values.currencyCode),

    transactedAt: dateInputToIsoDateTime(values.transactedAt),

    notes: normalizeOptionalText(values.notes),
  };
}
