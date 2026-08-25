import type {
  InvestmentAssetWithTransactionsItem,
  InvestmentHoldingItem,
  InvestmentPositionKind,
  InvestmentTransactionItem,
} from "@/types/investment-v2";

const QUANTITY_EPSILON = 1e-12;
const MONEY_EPSILON = 1e-8;

function assertNonNegativeNumber(
  value: number,
  fieldName: string,
  transactionId: string,
) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(
      `Invalid ${fieldName} in investment transaction ${transactionId}.`,
    );
  }
}

function requirePositiveQuantity(
  transaction: InvestmentTransactionItem,
): number {
  const quantity = transaction.quantity;

  if (quantity === null || !Number.isFinite(quantity) || quantity <= 0) {
    throw new Error(
      `Transaction ${transaction.id} requires a positive quantity.`,
    );
  }

  return quantity;
}

function sortTransactionsChronologically(
  transactions: InvestmentTransactionItem[],
) {
  return [...transactions].sort((a, b) => {
    const dateDifference =
      new Date(a.transactedAt).getTime() - new Date(b.transactedAt).getTime();

    if (dateDifference !== 0) {
      return dateDifference;
    }

    const createdAtDifference =
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    if (createdAtDifference !== 0) {
      return createdAtDifference;
    }

    return a.id.localeCompare(b.id);
  });
}

function getTransactionCurrencyCode(
  transactions: InvestmentTransactionItem[],
): string | null {
  const currencies = new Set(
    transactions.map((transaction) =>
      transaction.currencyCode.trim().toUpperCase(),
    ),
  );

  if (currencies.size === 0) {
    return null;
  }

  if (currencies.has("")) {
    throw new Error("Investment transaction contains an empty currency code.");
  }

  if (currencies.size > 1) {
    throw new Error(
      "Mixed transaction currencies are not supported yet. Historical FX normalization is required first.",
    );
  }

  return [...currencies][0];
}

function detectPositionKind(
  asset: InvestmentAssetWithTransactionsItem,
): InvestmentPositionKind {
  const hasQuantityTransactions = asset.transactions.some(
    (transaction) => transaction.type === "BUY" || transaction.type === "SELL",
  );

  const hasPrincipalTransactions = asset.transactions.some(
    (transaction) =>
      transaction.type === "OPEN" || transaction.type === "CLOSE",
  );

  if (hasQuantityTransactions && hasPrincipalTransactions) {
    throw new Error(
      `Investment asset ${asset.id} mixes quantity and principal transactions.`,
    );
  }

  if (hasPrincipalTransactions) {
    return "PRINCIPAL";
  }

  if (hasQuantityTransactions) {
    return "QUANTITY";
  }

  if (asset.instrumentType === "DEPOSIT") {
    return "PRINCIPAL";
  }

  return "QUANTITY";
}

function calculateQuantityHolding(
  asset: InvestmentAssetWithTransactionsItem,
): InvestmentHoldingItem {
  const transactions = sortTransactionsChronologically(asset.transactions);

  const transactionCurrencyCode = getTransactionCurrencyCode(transactions);

  let quantity = 0;
  let remainingCostBasis = 0;

  let realizedGainLoss = 0;
  let totalFees = 0;
  let netTransactionCashFlow = 0;

  for (const transaction of transactions) {
    assertNonNegativeNumber(
      transaction.grossAmount,
      "grossAmount",
      transaction.id,
    );

    assertNonNegativeNumber(transaction.feeAmount, "feeAmount", transaction.id);

    totalFees += transaction.feeAmount;

    if (transaction.type === "BUY") {
      const boughtQuantity = requirePositiveQuantity(transaction);

      const purchaseCost = transaction.grossAmount + transaction.feeAmount;

      quantity += boughtQuantity;
      remainingCostBasis += purchaseCost;

      netTransactionCashFlow -= purchaseCost;

      continue;
    }

    if (transaction.type === "SELL") {
      const soldQuantity = requirePositiveQuantity(transaction);

      if (soldQuantity > quantity + QUANTITY_EPSILON) {
        throw new Error(
          `Transaction ${transaction.id} attempts to sell more than the current holding.`,
        );
      }

      if (quantity <= QUANTITY_EPSILON) {
        throw new Error(
          `Transaction ${transaction.id} cannot sell an empty holding.`,
        );
      }

      const averageCostBeforeSale = remainingCostBasis / quantity;

      const allocatedCostBasis = averageCostBeforeSale * soldQuantity;

      const netProceeds = transaction.grossAmount - transaction.feeAmount;

      realizedGainLoss += netProceeds - allocatedCostBasis;

      quantity -= soldQuantity;

      remainingCostBasis -= allocatedCostBasis;

      netTransactionCashFlow += netProceeds;

      if (Math.abs(quantity) <= QUANTITY_EPSILON) {
        quantity = 0;
        remainingCostBasis = 0;
      }

      continue;
    }

    throw new Error(
      `Transaction ${transaction.id} with type ${transaction.type} is not valid for a quantity-based holding.`,
    );
  }

  const averageCostPerUnit =
    quantity > QUANTITY_EPSILON ? remainingCostBasis / quantity : null;

  return {
    assetId: asset.id,
    userId: asset.userId,

    name: asset.name,
    symbol: asset.symbol,

    category: asset.category,
    instrumentType: asset.instrumentType,
    valuationType: asset.valuationType,

    positionKind: "QUANTITY",

    transactionCurrencyCode,

    quantity,
    principalBalance: null,

    remainingCostBasis,
    averageCostPerUnit,

    realizedGainLoss,

    totalFees,

    netTransactionCashFlow,

    isClosed: transactions.length > 0 && quantity === 0,
  };
}

function calculatePrincipalHolding(
  asset: InvestmentAssetWithTransactionsItem,
): InvestmentHoldingItem {
  const transactions = sortTransactionsChronologically(asset.transactions);

  const transactionCurrencyCode = getTransactionCurrencyCode(transactions);

  let principalBalance = 0;

  let totalFees = 0;
  let netTransactionCashFlow = 0;

  for (const transaction of transactions) {
    assertNonNegativeNumber(
      transaction.grossAmount,
      "grossAmount",
      transaction.id,
    );

    assertNonNegativeNumber(transaction.feeAmount, "feeAmount", transaction.id);

    totalFees += transaction.feeAmount;

    if (transaction.type === "OPEN") {
      principalBalance += transaction.grossAmount;

      netTransactionCashFlow -= transaction.grossAmount + transaction.feeAmount;

      continue;
    }

    if (transaction.type === "CLOSE") {
      if (transaction.grossAmount > principalBalance + MONEY_EPSILON) {
        throw new Error(
          `Transaction ${transaction.id} attempts to close more principal than is currently open.`,
        );
      }

      principalBalance -= transaction.grossAmount;

      netTransactionCashFlow += transaction.grossAmount - transaction.feeAmount;

      if (Math.abs(principalBalance) <= MONEY_EPSILON) {
        principalBalance = 0;
      }

      continue;
    }

    throw new Error(
      `Transaction ${transaction.id} with type ${transaction.type} is not valid for a principal-based holding.`,
    );
  }

  return {
    assetId: asset.id,
    userId: asset.userId,

    name: asset.name,
    symbol: asset.symbol,

    category: asset.category,
    instrumentType: asset.instrumentType,
    valuationType: asset.valuationType,

    positionKind: "PRINCIPAL",

    transactionCurrencyCode,

    quantity: null,
    principalBalance,

    remainingCostBasis: principalBalance,
    averageCostPerUnit: null,

    realizedGainLoss: 0,

    totalFees,

    netTransactionCashFlow,

    isClosed: transactions.length > 0 && principalBalance === 0,
  };
}

export function calculateInvestmentHolding(
  asset: InvestmentAssetWithTransactionsItem,
): InvestmentHoldingItem {
  const positionKind = detectPositionKind(asset);

  if (positionKind === "PRINCIPAL") {
    return calculatePrincipalHolding(asset);
  }

  return calculateQuantityHolding(asset);
}
