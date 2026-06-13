"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
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

const FinanceContext = createContext<FinanceContextValue | null>(null);

function createTemporaryId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}`;
}

export default function FinanceProvider({ children }: FinanceProviderProps) {
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>(mockIncomeItems);
  const [expenseItems, setExpenseItems] =
    useState<ExpenseItem[]>(mockExpenseItems);
  const [investmentItems, setInvestmentItems] =
    useState<InvestmentItem[]>(mockInvestmentItems);
  const [loanItems, setLoanItems] = useState<LoanItem[]>(mockLoanItems);

  useEffect(() => {
    const storedData = loadFinanceStorageData();

    if (storedData) {
      setIncomeItems(storedData.incomeItems);
      setExpenseItems(storedData.expenseItems);
      setInvestmentItems(storedData.investmentItems);
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

  function createIncome(payload: CreateIncomePayload) {
    const now = new Date().toISOString();

    const newIncome: IncomeItem = {
      id: createTemporaryId("income"),
      userId: "user_1",
      title: payload.title,
      category: payload.category,
      amount: payload.amount,
      receivedAt: payload.receivedAt,
      frequency: payload.frequency,
      notes: payload.notes,
      createdAt: now,
      updatedAt: now,
    };

    setIncomeItems((currentItems) => [newIncome, ...currentItems]);
  }

  function createExpense(payload: CreateExpensePayload) {
    const now = new Date().toISOString();

    const newExpense: ExpenseItem = {
      id: createTemporaryId("expense"),
      userId: "user_1",
      title: payload.title,
      category: payload.category,
      type: payload.type,
      amount: payload.amount,
      spentAt: payload.spentAt,
      notes: payload.notes,
      createdAt: now,
      updatedAt: now,
    };

    setExpenseItems((currentItems) => [newExpense, ...currentItems]);
  }

  function createInvestment(payload: CreateInvestmentPayload) {
    const now = new Date().toISOString();

    const newInvestment: InvestmentItem = {
      id: createTemporaryId("investment"),
      userId: "user_1",
      assetName: payload.assetName,
      category: payload.category,
      investedAmount: payload.investedAmount,
      currentValue: payload.currentValue,
      investedAt: payload.investedAt,
      notes: payload.notes,
      createdAt: now,
      updatedAt: now,
    };

    setInvestmentItems((currentItems) => [newInvestment, ...currentItems]);
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

  function deleteIncome(incomeId: string) {
    setIncomeItems((currentItems) =>
      currentItems.filter((item) => item.id !== incomeId),
    );
  }

  function deleteExpense(expenseId: string) {
    setExpenseItems((currentItems) =>
      currentItems.filter((item) => item.id !== expenseId),
    );
  }

  function deleteInvestment(investmentId: string) {
    setInvestmentItems((currentItems) =>
      currentItems.filter((item) => item.id !== investmentId),
    );
  }

  function deleteLoan(loanId: string) {
    setLoanItems((currentItems) =>
      currentItems.filter((item) => item.id !== loanId),
    );
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
