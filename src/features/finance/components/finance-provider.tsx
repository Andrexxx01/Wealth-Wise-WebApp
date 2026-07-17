"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  clearFinanceStorageData,
  loadFinanceStorageData,
  saveFinanceStorageData,
} from "@/lib/finance-storage";
import { mockExpenseItems } from "@/lib/mock-data/expense";
import { mockIncomeItems } from "@/lib/mock-data/income";
import { mockInvestmentItems } from "@/lib/mock-data/investment";
import { mockLoanItems } from "@/lib/mock-data/loan";
import type { ExpenseItem } from "@/types/expense";
import type {
  CreateExpensePayload,
  CreateIncomePayload,
  CreateInvestmentPayload,
  CreateLoanPayload,
} from "@/types/form-payload";
import type {
  FinanceContextValue,
  FinanceProviderProps,
} from "@/types/finance-context";
import type { IncomeItem } from "@/types/income";
import type { InvestmentItem } from "@/types/investment";
import type { LoanItem } from "@/types/loan";
import {
  createIncomeItem,
  deleteIncomeItem,
  getIncomeItems,
  updateIncomeItem,
} from "@/features/income/api/income-api";
import {
  createExpenseItem,
  deleteExpenseItem,
  getExpenseItems,
  updateExpenseItem,
} from "@/features/expenses/api/expense-api";
import {
  createInvestmentItem,
  deleteInvestmentItem,
  getInvestmentItems,
  updateInvestmentItem,
} from "@/features/investments/api/investment-api";

const FinanceContext = createContext<FinanceContextValue | null>(null);

function createTemporaryId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}`;
}

export default function FinanceProvider({ children }: FinanceProviderProps) {
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [isExpenseLoading, setIsExpenseLoading] = useState(true);
  const [expenseError, setExpenseError] = useState<string | null>(null);
  const [investmentItems, setInvestmentItems] = useState<InvestmentItem[]>([]);
  const [isInvestmentLoading, setIsInvestmentLoading] = useState(true);
  const [investmentError, setInvestmentError] = useState<string | null>(null);
  const [loanItems, setLoanItems] = useState<LoanItem[]>(mockLoanItems);
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);
  const [isIncomeLoading, setIsIncomeLoading] = useState(true);
  const [incomeError, setIncomeError] = useState<string | null>(null);

  useEffect(() => {
    const storedData = loadFinanceStorageData();

    if (storedData) {
      setLoanItems(storedData.loanItems);
    }

    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;

    saveFinanceStorageData({
      incomeItems,
      expenseItems,
      investmentItems,
      loanItems,
    });
  }, [hasLoadedStorage, incomeItems, expenseItems, investmentItems, loanItems]);

  useEffect(() => {
    let isMounted = true;

    async function loadIncomeItems() {
      try {
        setIsIncomeLoading(true);
        setIncomeError(null);

        const data = await getIncomeItems();

        if (isMounted) {
          setIncomeItems(data);
        }
      } catch (error) {
        console.error("Failed to load income items:", error);

        if (isMounted) {
          setIncomeError("Failed to load income records.");
        }
      } finally {
        if (isMounted) {
          setIsIncomeLoading(false);
        }
      }
    }

    loadIncomeItems();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadExpenseItems() {
      try {
        setIsExpenseLoading(true);
        setExpenseError(null);

        const data = await getExpenseItems();

        if (isMounted) {
          setExpenseItems(data);
        }
      } catch (error) {
        console.error("Failed to load expense items:", error);

        if (isMounted) {
          setExpenseError("Failed to load expense records.");
        }
      } finally {
        if (isMounted) {
          setIsExpenseLoading(false);
        }
      }
    }

    loadExpenseItems();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInvestmentItems() {
      try {
        setIsInvestmentLoading(true);
        setInvestmentError(null);

        const data = await getInvestmentItems();

        if (isMounted) {
          setInvestmentItems(data);
        }
      } catch (error) {
        console.error("Failed to load investment items:", error);

        if (isMounted) {
          setInvestmentError("Failed to load investment records.");
        }
      } finally {
        if (isMounted) {
          setIsInvestmentLoading(false);
        }
      }
    }

    loadInvestmentItems();

    return () => {
      isMounted = false;
    };
  }, []);

  async function createIncome(payload: CreateIncomePayload) {
    const createdIncome = await createIncomeItem(payload);

    setIncomeItems((currentItems) => [createdIncome, ...currentItems]);
  }

  async function updateIncome(incomeId: string, payload: CreateIncomePayload) {
    const updatedIncome = await updateIncomeItem(incomeId, payload);

    setIncomeItems((currentItems) =>
      currentItems.map((item) => (item.id === incomeId ? updatedIncome : item)),
    );
  }

  async function createExpense(payload: CreateExpensePayload) {
    const createdExpense = await createExpenseItem(payload);

    setExpenseItems((currentItems) => [createdExpense, ...currentItems]);
  }

  async function updateExpense(
    expenseId: string,
    payload: CreateExpensePayload,
  ) {
    const updatedExpense = await updateExpenseItem(expenseId, payload);

    setExpenseItems((currentItems) =>
      currentItems.map((item) =>
        item.id === expenseId ? updatedExpense : item,
      ),
    );
  }

  async function createInvestment(payload: CreateInvestmentPayload) {
    const createdInvestment = await createInvestmentItem(payload);

    setInvestmentItems((currentItems) => [createdInvestment, ...currentItems]);
  }

  async function updateInvestment(
    investmentId: string,
    payload: CreateInvestmentPayload,
  ) {
    const updatedInvestment = await updateInvestmentItem(investmentId, payload);

    setInvestmentItems((currentItems) =>
      currentItems.map((item) =>
        item.id === investmentId ? updatedInvestment : item,
      ),
    );
  }

  function createLoan(payload: CreateLoanPayload) {
    const now = new Date().toISOString();

    const status: LoanItem["status"] =
      payload.remainingBalance <= 0 ? "PAID_OFF" : "ACTIVE";

    const newLoan: LoanItem = {
      id: createTemporaryId("loan"),
      userId: "user_1",
      title: payload.title,
      lenderName: payload.lenderName,
      category: payload.category,
      principalAmount: payload.principalAmount,
      remainingBalance: payload.remainingBalance,
      monthlyPayment: payload.monthlyPayment,
      interestRate: payload.interestRate,
      dueDate: payload.dueDate,
      status,
      createdAt: now,
      updatedAt: now,
    };

    setLoanItems((currentItems) => [newLoan, ...currentItems]);
  }

  function updateLoan(loanId: string, payload: CreateLoanPayload) {
    const now = new Date().toISOString();

    setLoanItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== loanId) {
          return item;
        }

        const status: LoanItem["status"] =
          payload.remainingBalance <= 0 ? "PAID_OFF" : "ACTIVE";

        return {
          ...item,
          title: payload.title,
          lenderName: payload.lenderName,
          category: payload.category,
          principalAmount: payload.principalAmount,
          remainingBalance: payload.remainingBalance,
          monthlyPayment: payload.monthlyPayment,
          interestRate: payload.interestRate,
          dueDate: payload.dueDate,
          status,
          updatedAt: now,
        };
      }),
    );
  }

  async function deleteIncome(incomeId: string) {
    await deleteIncomeItem(incomeId);

    setIncomeItems((currentItems) =>
      currentItems.filter((item) => item.id !== incomeId),
    );
  }

  async function deleteExpense(expenseId: string) {
    await deleteExpenseItem(expenseId);

    setExpenseItems((currentItems) =>
      currentItems.filter((item) => item.id !== expenseId),
    );
  }

  async function deleteInvestment(investmentId: string) {
    await deleteInvestmentItem(investmentId);

    setInvestmentItems((currentItems) =>
      currentItems.filter((item) => item.id !== investmentId),
    );
  }

  function deleteLoan(loanId: string) {
    setLoanItems((currentItems) =>
      currentItems.filter((item) => item.id !== loanId),
    );
  }

  function resetFinanceData() {
    clearFinanceStorageData();

    setLoanItems(mockLoanItems);
  }

  const value: FinanceContextValue = {
    incomeItems,
    expenseItems,
    investmentItems,
    loanItems,
    createIncome,
    createExpense,
    createInvestment,
    createLoan,
    deleteIncome,
    deleteExpense,
    deleteInvestment,
    deleteLoan,
    resetFinanceData,
    updateIncome,
    updateExpense,
    updateInvestment,
    updateLoan,
    isIncomeLoading,
    incomeError,
    isExpenseLoading,
    expenseError,
    isInvestmentLoading,
    investmentError,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error("useFinance must be used inside FinanceProvider.");
  }

  return context;
}
