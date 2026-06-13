import type { FinanceStorageData } from "@/types/finance-storage";

const FINANCE_STORAGE_KEY = "wealthwise.finance-data.v1";

function isFinanceStorageData(value: unknown): value is FinanceStorageData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as FinanceStorageData;

  return (
    Array.isArray(data.incomeItems) &&
    Array.isArray(data.expenseItems) &&
    Array.isArray(data.investmentItems) &&
    Array.isArray(data.loanItems)
  );
}

export function loadFinanceStorageData() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(FINANCE_STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isFinanceStorageData(parsedValue)) {
      window.localStorage.removeItem(FINANCE_STORAGE_KEY);
      return null;
    }

    return parsedValue;
  } catch {
    window.localStorage.removeItem(FINANCE_STORAGE_KEY);
    return null;
  }
}

export function saveFinanceStorageData(data: FinanceStorageData) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(data));
}

export function clearFinanceStorageData() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(FINANCE_STORAGE_KEY);
}
