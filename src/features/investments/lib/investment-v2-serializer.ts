import type {
  InvestmentAssetItem,
  InvestmentAssetWithTransactionsItem,
  InvestmentEventItem,
  InvestmentTransactionItem,
} from "@/types/investment-v2";

type SerializableInvestmentAsset = {
  id: string;
  userId: string;

  name: string;
  category: InvestmentAssetItem["category"];
  instrumentType: InvestmentAssetItem["instrumentType"];
  valuationType: InvestmentAssetItem["valuationType"];

  symbol: string | null;
  exchange: string | null;
  isin: string | null;
  issuer: string | null;
  underlyingIndex: string | null;

  unit: string | null;
  pricingUnit: string | null;

  marketCurrencyCode: string | null;

  annualInterestRate: unknown;
  couponRate: unknown;
  faceValue: unknown;
  maturityDate: Date | null;

  notes: string | null;

  createdAt: Date;
  updatedAt: Date;
};

type SerializableInvestmentTransaction = {
  id: string;

  userId: string;
  assetId: string;

  type: InvestmentTransactionItem["type"];

  quantity: unknown;

  grossAmount: unknown;
  feeAmount: unknown;

  currencyCode: string;

  transactedAt: Date;

  notes: string | null;

  createdAt: Date;
  updatedAt: Date;
};

type SerializableInvestmentEvent = {
  id: string;

  userId: string;
  assetId: string;

  type: InvestmentEventItem["type"];

  grossAmount: unknown;
  feeAmount: unknown;
  taxAmount: unknown;

  currencyCode: string | null;

  occurredAt: Date;

  notes: string | null;

  createdAt: Date;
  updatedAt: Date;
};

function nullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

export function serializeInvestmentAsset(
  asset: SerializableInvestmentAsset,
): InvestmentAssetItem {
  return {
    id: asset.id,
    userId: asset.userId,

    name: asset.name,
    category: asset.category,
    instrumentType: asset.instrumentType,
    valuationType: asset.valuationType,

    symbol: asset.symbol,
    exchange: asset.exchange,
    isin: asset.isin,
    issuer: asset.issuer,
    underlyingIndex: asset.underlyingIndex,

    unit: asset.unit,
    pricingUnit: asset.pricingUnit,

    marketCurrencyCode: asset.marketCurrencyCode,

    annualInterestRate: nullableNumber(asset.annualInterestRate),
    couponRate: nullableNumber(asset.couponRate),
    faceValue: nullableNumber(asset.faceValue),

    maturityDate: asset.maturityDate?.toISOString() ?? null,

    notes: asset.notes,

    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  };
}

export function serializeInvestmentTransaction(
  transaction: SerializableInvestmentTransaction,
): InvestmentTransactionItem {
  return {
    id: transaction.id,

    userId: transaction.userId,
    assetId: transaction.assetId,

    type: transaction.type,

    quantity: nullableNumber(transaction.quantity),

    grossAmount: Number(transaction.grossAmount),
    feeAmount: Number(transaction.feeAmount),

    currencyCode: transaction.currencyCode,

    transactedAt: transaction.transactedAt.toISOString(),

    notes: transaction.notes,

    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}

export function serializeInvestmentEvent(
  event: SerializableInvestmentEvent,
): InvestmentEventItem {
  return {
    id: event.id,

    userId: event.userId,
    assetId: event.assetId,

    type: event.type,

    grossAmount: nullableNumber(event.grossAmount),
    feeAmount: Number(event.feeAmount),
    taxAmount: Number(event.taxAmount),

    currencyCode: event.currencyCode,

    occurredAt: event.occurredAt.toISOString(),

    notes: event.notes,

    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

export function serializeInvestmentAssetWithTransactions(
  asset: SerializableInvestmentAsset & {
    transactions: SerializableInvestmentTransaction[];
    events: SerializableInvestmentEvent[];
  },
): InvestmentAssetWithTransactionsItem {
  return {
    ...serializeInvestmentAsset(asset),

    transactions: asset.transactions.map(serializeInvestmentTransaction),

    events: asset.events.map(serializeInvestmentEvent),
  };
}
