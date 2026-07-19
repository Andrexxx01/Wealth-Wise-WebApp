"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

const FinanceContext = createContext<FinanceContextValue | null>(null);

export default function FinanceProvider({ children }: FinanceProviderProps) {
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);
  const [isIncomeLoading, setIsIncomeLoading] = useState(true);
  const [incomeError, setIncomeError] = useState<string | null>(null);

  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [isExpenseLoading, setIsExpenseLoading] = useState(true);
  const [expenseError, setExpenseError] = useState<string | null>(null);

  const [investmentItems, setInvestmentItems] = useState<InvestmentItem[]>([]);
  const [isInvestmentLoading, setIsInvestmentLoading] = useState(true);
  const [investmentError, setInvestmentError] = useState<string | null>(null);

  const [loanItems, setLoanItems] = useState<LoanItem[]>([]);
  const [isLoanLoading, setIsLoanLoading] = useState(true);
  const [loanError, setLoanError] = useState<string | null>(null);

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

    loadLoanItems();

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

  async function deleteIncome(incomeId: string) {
    await deleteIncomeItem(incomeId);

    setIncomeItems((currentItems) =>
      currentItems.filter((item) => item.id !== incomeId),
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

  async function deleteExpense(expenseId: string) {
    await deleteExpenseItem(expenseId);

    setExpenseItems((currentItems) =>
      currentItems.filter((item) => item.id !== expenseId),
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

  async function deleteInvestment(investmentId: string) {
    await deleteInvestmentItem(investmentId);

    setInvestmentItems((currentItems) =>
      currentItems.filter((item) => item.id !== investmentId),
    );
  }

  async function createLoan(payload: CreateLoanPayload) {
    const createdLoan = await createLoanItem(payload);

    setLoanItems((currentItems) => [createdLoan, ...currentItems]);
  }

  async function updateLoan(loanId: string, payload: CreateLoanPayload) {
    const updatedLoan = await updateLoanItem(loanId, payload);

    setLoanItems((currentItems) =>
      currentItems.map((item) => (item.id === loanId ? updatedLoan : item)),
    );
  }

  async function deleteLoan(loanId: string) {
    await deleteLoanItem(loanId);

    setLoanItems((currentItems) =>
      currentItems.filter((item) => item.id !== loanId),
    );
  }

  function resetFinanceData() {
    clearFinanceStorageData();
  }

  const value: FinanceContextValue = {
    incomeItems,
    expenseItems,
    investmentItems,
    loanItems,

    isIncomeLoading,
    incomeError,
    isExpenseLoading,
    expenseError,
    isInvestmentLoading,
    investmentError,
    isLoanLoading,
    loanError,

    createIncome,
    createExpense,
    createInvestment,
    createLoan,

    updateIncome,
    updateExpense,
    updateInvestment,
    updateLoan,

    deleteIncome,
    deleteExpense,
    deleteInvestment,
    deleteLoan,

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
