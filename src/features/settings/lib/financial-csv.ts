export const EXPORT_COLLECTIONS = [
  { key: "budgets", label: "Monthly budgets", columns: ["id", "month", "category", "currency", "amount", "createdAt", "updatedAt"] },
  { key: "incomes", label: "Income", columns: ["id", "title", "category", "amount", "currency", "receivedAt", "frequency", "notes", "createdAt", "updatedAt"] },
  { key: "expenses", label: "Expenses", columns: ["id", "title", "category", "type", "amount", "currency", "spentAt", "notes", "createdAt", "updatedAt"] },
  { key: "investmentAssets", label: "Investment assets", columns: ["id", "name", "category", "instrumentType", "valuationType", "symbol", "providerSymbol", "exchange", "isin", "issuer", "underlyingIndex", "unit", "pricingUnit", "marketCurrencyCode", "manualPrice", "manualPriceUpdatedAt", "currentNav", "navUpdatedAt", "annualInterestRate", "couponRate", "faceValue", "maturityDate", "notes", "createdAt", "updatedAt"] },
  { key: "investmentTransactions", label: "Investment transactions", columns: ["id", "assetId", "type", "quantity", "grossAmount", "feeAmount", "currencyCode", "transactedAt", "notes", "createdAt", "updatedAt"] },
  { key: "investmentEvents", label: "Investment events", columns: ["id", "assetId", "type", "grossAmount", "feeAmount", "taxAmount", "currencyCode", "occurredAt", "notes", "createdAt", "updatedAt"] },
  { key: "loans", label: "Loans", columns: ["id", "title", "lenderName", "category", "currency", "principalAmount", "remainingBalance", "monthlyPayment", "interestRate", "dueDate", "status", "createdAt", "updatedAt"] },
] as const;

export type ExportCollection = (typeof EXPORT_COLLECTIONS)[number]["key"];

const numericColumns = new Set([
  "amount", "manualPrice", "currentNav", "annualInterestRate", "couponRate",
  "faceValue", "quantity", "grossAmount", "feeAmount", "taxAmount",
  "principalAmount", "remainingBalance", "monthlyPayment", "interestRate",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function csvCell(value: unknown, numeric = false): string {
  if (value === null || value === undefined) return '""';
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
    throw new Error("Unexpected export value. Please try again.");
  }
  let text = String(value);
  const isNumber = numeric && /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(text);
  if (numeric && !isNumber) throw new Error("Invalid number in export data.");
  // Quoting alone does not prevent spreadsheet formulas in user-entered text.
  if (!isNumber && /^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}

export function buildFinancialCsv(payload: unknown, collection: ExportCollection): string {
  if (!isRecord(payload) || payload.application !== "WealthWise" || payload.schemaVersion !== 1 || !isRecord(payload.data)) {
    throw new Error("Unexpected export format. Refresh the page and try again.");
  }
  const definition = EXPORT_COLLECTIONS.find((item) => item.key === collection);
  if (!definition) throw new Error("Select a valid data category.");
  const rows = payload.data[collection];
  if (!Array.isArray(rows)) throw new Error("Missing export records. Please try again.");
  const lines = [definition.columns.map((column) => csvCell(column)).join(",")];
  for (const row of rows) {
    if (!isRecord(row)) throw new Error("Invalid export record. Please try again.");
    lines.push(definition.columns.map((column) => csvCell(row[column], numericColumns.has(column))).join(","));
  }
  // UTF-8 BOM helps spreadsheet apps detect non-ASCII names and notes.
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}
