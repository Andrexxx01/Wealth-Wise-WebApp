"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { clearFinanceStorageData } from "@/lib/finance-storage";

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

import {
  createLoanItem,
  deleteLoanItem,
  getLoanItems,
  updateLoanItem,
} from "@/features/loans/api/loan-api";

import {
  createInvestmentAssetV2 as createInvestmentAssetV2Api,
  createInvestmentTransactionV2 as createInvestmentTransactionV2Api,
  getInvestmentRecentTransactionsV2,
  getInvestmentValuationsV2,
} from "@/features/investments/api/investment-v2-api";

import type {
  CreateInvestmentAssetV2Payload,
  CreateInvestmentTransactionV2Payload,
  InvestmentRecentTransactionV2Item,
  InvestmentValuationsResponse,
} from "@/types/investment-v2";

const INVESTMENT_PORTFOLIO_RETRY_DELAY_MS = 10_000;

const MAX_INVESTMENT_PORTFOLIO_PRICE_RETRIES = 1;

const FinanceContext = createContext<FinanceContextValue | null>(null);

export default function FinanceProvider({ children }: FinanceProviderProps) {
  // =====================================================
  // INCOME STATE
  // =====================================================

  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);

  const [isIncomeLoading, setIsIncomeLoading] = useState(true);

  const [incomeError, setIncomeError] = useState<string | null>(null);

  // =====================================================
  // EXPENSE STATE
  // =====================================================

  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);

  const [isExpenseLoading, setIsExpenseLoading] = useState(true);

  const [expenseError, setExpenseError] = useState<string | null>(null);

  // =====================================================
  // LEGACY INVESTMENT STATE
  // =====================================================

  const [investmentItems, setInvestmentItems] = useState<InvestmentItem[]>([]);

  const [isInvestmentLoading, setIsInvestmentLoading] = useState(true);

  const [investmentError, setInvestmentError] = useState<string | null>(null);

  // =====================================================
  // INVESTMENT V2 STATE
  // =====================================================

  const [investmentPortfolioV2, setInvestmentPortfolioV2] =
    useState<InvestmentValuationsResponse | null>(null);

  const [isInvestmentPortfolioV2Loading, setIsInvestmentPortfolioV2Loading] =
    useState(true);

  const [investmentPortfolioV2Error, setInvestmentPortfolioV2Error] = useState<
    string | null
  >(null);

  const [investmentTransactionsV2, setInvestmentTransactionsV2] = useState<
    InvestmentRecentTransactionV2Item[]
  >([]);

  const [
    isInvestmentTransactionsV2Loading,
    setIsInvestmentTransactionsV2Loading,
  ] = useState(true);

  const [investmentTransactionsV2Error, setInvestmentTransactionsV2Error] =
    useState<string | null>(null);

  // =====================================================
  // INVESTMENT V2 REF
  // =====================================================

  /*
   * Menyimpan timeout untuk retry market price.
   *
   * Kita hanya ingin memiliki maksimal
   * satu timer retry yang aktif.
   */
  const investmentPortfolioV2RetryTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  /*
   * Menghitung berapa kali retry otomatis
   * dilakukan untuk PRICE_UNAVAILABLE.
   *
   * Ini mencegah polling tanpa batas.
   */
  const investmentPortfolioV2RetryCountRef = useRef(0);

  /*
   * Mencegah dua request refresh V2
   * berjalan bersamaan.
   */
  const isInvestmentPortfolioV2RefreshRunningRef = useRef(false);

  // =====================================================
  // LOAN STATE
  // =====================================================

  const [loanItems, setLoanItems] = useState<LoanItem[]>([]);

  const [isLoanLoading, setIsLoanLoading] = useState(true);

  const [loanError, setLoanError] = useState<string | null>(null);

  // =====================================================
  // CLEAR INVESTMENT V2 RETRY TIMER
  // =====================================================

  const clearInvestmentPortfolioV2RetryTimeout = useCallback(() => {
    if (!investmentPortfolioV2RetryTimeoutRef.current) {
      return;
    }

    clearTimeout(investmentPortfolioV2RetryTimeoutRef.current);

    investmentPortfolioV2RetryTimeoutRef.current = null;
  }, []);

  // =====================================================
  // REFRESH INVESTMENT PORTFOLIO V2
  // =====================================================

  const refreshInvestmentPortfolioV2 = useCallback(async () => {
    /*
     * Kalau request sebelumnya masih berjalan,
     * jangan jalankan request kedua.
     */
    if (isInvestmentPortfolioV2RefreshRunningRef.current) {
      return;
    }

    isInvestmentPortfolioV2RefreshRunningRef.current = true;

    try {
      setIsInvestmentPortfolioV2Loading(true);

      setInvestmentPortfolioV2Error(null);

      const data = await getInvestmentValuationsV2();

      setInvestmentPortfolioV2(data);
    } catch (error) {
      console.error("Failed to load investment portfolio V2:", error);

      setInvestmentPortfolioV2Error("Failed to load investment portfolio.");
    } finally {
      setIsInvestmentPortfolioV2Loading(false);

      isInvestmentPortfolioV2RefreshRunningRef.current = false;
    }
  }, []);

  const refreshInvestmentTransactionsV2 = useCallback(async () => {
    try {
      setIsInvestmentTransactionsV2Loading(true);

      setInvestmentTransactionsV2Error(null);

      const response = await getInvestmentRecentTransactionsV2();

      setInvestmentTransactionsV2(response.data);
    } catch (error) {
      console.error("Failed to load investment transactions V2:", error);

      setInvestmentTransactionsV2Error(
        "Failed to load investment transactions.",
      );
    } finally {
      setIsInvestmentTransactionsV2Loading(false);
    }
  }, []);

  // =====================================================
  // LOAD INCOME
  // =====================================================

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

    void loadIncomeItems();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // LOAD EXPENSE
  // =====================================================

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

    void loadExpenseItems();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // LOAD LEGACY INVESTMENT
  // =====================================================

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

    void loadInvestmentItems();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // LOAD LOANS
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    async function loadLoanItems() {
      try {
        setIsLoanLoading(true);

        setLoanError(null);

        const data = await getLoanItems();

        if (isMounted) {
          setLoanItems(data);
        }
      } catch (error) {
        console.error("Failed to load loan items:", error);

        if (isMounted) {
          setLoanError("Failed to load loan records.");
        }
      } finally {
        if (isMounted) {
          setIsLoanLoading(false);
        }
      }
    }

    void loadLoanItems();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // INITIAL LOAD INVESTMENT V2
  // =====================================================

  useEffect(() => {
    void refreshInvestmentPortfolioV2();
  }, [refreshInvestmentPortfolioV2]);

  useEffect(() => {
    void refreshInvestmentTransactionsV2();
  }, [refreshInvestmentTransactionsV2]);

  // =====================================================
  // RETRY PRICE_UNAVAILABLE ONCE
  // =====================================================

  useEffect(() => {
    if (!investmentPortfolioV2) {
      return;
    }

    const hasTemporarilyUnavailablePrice = investmentPortfolioV2.data.some(
      (valuation) => valuation.valuationStatus === "PRICE_UNAVAILABLE",
    );

    /*
     * Kalau semua price sudah berhasil,
     * reset counter agar retry tersedia
     * untuk kemungkinan masalah berikutnya.
     */
    if (!hasTemporarilyUnavailablePrice) {
      investmentPortfolioV2RetryCountRef.current = 0;

      clearInvestmentPortfolioV2RetryTimeout();

      return;
    }

    /*
     * Jangan retry lebih dari limit.
     */
    if (
      investmentPortfolioV2RetryCountRef.current >=
      MAX_INVESTMENT_PORTFOLIO_PRICE_RETRIES
    ) {
      return;
    }

    /*
     * Jangan membuat timer kedua kalau
     * timer retry sudah ada.
     */
    if (investmentPortfolioV2RetryTimeoutRef.current) {
      return;
    }

    investmentPortfolioV2RetryCountRef.current += 1;

    investmentPortfolioV2RetryTimeoutRef.current = setTimeout(() => {
      investmentPortfolioV2RetryTimeoutRef.current = null;

      void refreshInvestmentPortfolioV2();
    }, INVESTMENT_PORTFOLIO_RETRY_DELAY_MS);

    return () => {
      clearInvestmentPortfolioV2RetryTimeout();
    };
  }, [
    investmentPortfolioV2,
    refreshInvestmentPortfolioV2,
    clearInvestmentPortfolioV2RetryTimeout,
  ]);

  // =====================================================
  // REFRESH WHEN USER RETURNS TO BROWSER TAB
  // =====================================================

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState !== "visible") {
        return;
      }

      /*
       * Kalau ada retry lama yang masih menunggu,
       * buang karena kita akan refresh sekarang.
       */
      clearInvestmentPortfolioV2RetryTimeout();

      /*
       * Saat user kembali ke aplikasi,
       * beri kesempatan retry dari awal.
       */
      investmentPortfolioV2RetryCountRef.current = 0;

      void refreshInvestmentPortfolioV2();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshInvestmentPortfolioV2, clearInvestmentPortfolioV2RetryTimeout]);

  // =====================================================
  // CLEAN UP RETRY TIMER ON UNMOUNT
  // =====================================================

  useEffect(() => {
    return () => {
      clearInvestmentPortfolioV2RetryTimeout();
    };
  }, [clearInvestmentPortfolioV2RetryTimeout]);

  // =====================================================
  // CREATE INCOME
  // =====================================================

  async function createIncome(payload: CreateIncomePayload) {
    const createdIncome = await createIncomeItem(payload);

    setIncomeItems((currentItems) => [createdIncome, ...currentItems]);
  }

  // =====================================================
  // UPDATE INCOME
  // =====================================================

  async function updateIncome(incomeId: string, payload: CreateIncomePayload) {
    const updatedIncome = await updateIncomeItem(incomeId, payload);

    setIncomeItems((currentItems) =>
      currentItems.map((item) => (item.id === incomeId ? updatedIncome : item)),
    );
  }

  // =====================================================
  // DELETE INCOME
  // =====================================================

  async function deleteIncome(incomeId: string) {
    await deleteIncomeItem(incomeId);

    setIncomeItems((currentItems) =>
      currentItems.filter((item) => item.id !== incomeId),
    );
  }

  // =====================================================
  // CREATE EXPENSE
  // =====================================================

  async function createExpense(payload: CreateExpensePayload) {
    const createdExpense = await createExpenseItem(payload);

    setExpenseItems((currentItems) => [createdExpense, ...currentItems]);
  }

  // =====================================================
  // UPDATE EXPENSE
  // =====================================================

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

  // =====================================================
  // DELETE EXPENSE
  // =====================================================

  async function deleteExpense(expenseId: string) {
    await deleteExpenseItem(expenseId);

    setExpenseItems((currentItems) =>
      currentItems.filter((item) => item.id !== expenseId),
    );
  }

  // =====================================================
  // CREATE LEGACY INVESTMENT
  // =====================================================

  async function createInvestment(payload: CreateInvestmentPayload) {
    const createdInvestment = await createInvestmentItem(payload);

    setInvestmentItems((currentItems) => [createdInvestment, ...currentItems]);
  }

  // =====================================================
  // CREATE INVESTMENT ASSET V2
  // =====================================================

  async function createInvestmentAsset(
    payload: CreateInvestmentAssetV2Payload,
  ) {
    clearInvestmentPortfolioV2RetryTimeout();

    investmentPortfolioV2RetryCountRef.current = 0;

    await createInvestmentAssetV2Api(payload);

    await Promise.all([
      refreshInvestmentPortfolioV2(),
      refreshInvestmentTransactionsV2(),
    ]);
  }

  // =====================================================
  // ADD INVESTMENT TRANSACTION V2
  // =====================================================

  async function addInvestmentTransaction(
    assetId: string,
    payload: CreateInvestmentTransactionV2Payload,
  ) {
    clearInvestmentPortfolioV2RetryTimeout();

    investmentPortfolioV2RetryCountRef.current = 0;

    await createInvestmentTransactionV2Api(assetId, payload);

    await Promise.all([
      refreshInvestmentPortfolioV2(),
      refreshInvestmentTransactionsV2(),
    ]);
  }

  // =====================================================
  // UPDATE LEGACY INVESTMENT
  // =====================================================

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

  // =====================================================
  // DELETE LEGACY INVESTMENT
  // =====================================================

  async function deleteInvestment(investmentId: string) {
    await deleteInvestmentItem(investmentId);

    setInvestmentItems((currentItems) =>
      currentItems.filter((item) => item.id !== investmentId),
    );
  }

  // =====================================================
  // CREATE LOAN
  // =====================================================

  async function createLoan(payload: CreateLoanPayload) {
    const createdLoan = await createLoanItem(payload);

    setLoanItems((currentItems) => [createdLoan, ...currentItems]);
  }

  // =====================================================
  // UPDATE LOAN
  // =====================================================

  async function updateLoan(loanId: string, payload: CreateLoanPayload) {
    const updatedLoan = await updateLoanItem(loanId, payload);

    setLoanItems((currentItems) =>
      currentItems.map((item) => (item.id === loanId ? updatedLoan : item)),
    );
  }

  // =====================================================
  // DELETE LOAN
  // =====================================================

  async function deleteLoan(loanId: string) {
    await deleteLoanItem(loanId);

    setLoanItems((currentItems) =>
      currentItems.filter((item) => item.id !== loanId),
    );
  }

  // =====================================================
  // RESET FINANCE DATA
  // =====================================================

  function resetFinanceData() {
    clearFinanceStorageData();
  }

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value: FinanceContextValue = {
    incomeItems,
    expenseItems,
    investmentItems,
    loanItems,

    investmentPortfolioV2,
    investmentTransactionsV2,
    isIncomeLoading,
    incomeError,

    isExpenseLoading,
    expenseError,

    isInvestmentLoading,
    investmentError,

    isInvestmentPortfolioV2Loading,
    investmentPortfolioV2Error,
    isInvestmentTransactionsV2Loading,
    investmentTransactionsV2Error,
    isLoanLoading,
    loanError,

    createIncome,
    createExpense,
    createInvestment,
    createLoan,

    createInvestmentAsset,
    addInvestmentTransaction,

    updateIncome,
    updateExpense,
    updateInvestment,
    updateLoan,

    deleteIncome,
    deleteExpense,
    deleteInvestment,
    deleteLoan,

    refreshInvestmentPortfolioV2,
    refreshInvestmentTransactionsV2,
    resetFinanceData,
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
