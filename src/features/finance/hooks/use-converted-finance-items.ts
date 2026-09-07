"use client";

import { useMemo } from "react";

import { useCurrentUser } from "@/features/auth/components/current-user-provider";
import { useExchangeRate } from "@/features/currency/hooks/use-exchange-rate";
import { useFinance } from "@/features/finance/components/finance-provider";

import { convertCurrency } from "@/lib/currency-conversion";

export function useConvertedFinanceItems() {
  const { currentUser } = useCurrentUser();

  const { incomeItems, expenseItems, loanItems } = useFinance();

  const { usdToIdrRate, isExchangeRateLoading, exchangeRateError } =
    useExchangeRate();

  const displayCurrency = currentUser.currency;

  // =====================================================
  // DETERMINE WHETHER FX IS REQUIRED
  // =====================================================

  const needsExchangeRate = useMemo(() => {
    return (
      incomeItems.some((item) => item.currency !== displayCurrency) ||
      expenseItems.some((item) => item.currency !== displayCurrency) ||
      loanItems.some((item) => item.currency !== displayCurrency)
    );
  }, [incomeItems, expenseItems, loanItems, displayCurrency]);

  const isCurrencyConversionReady = !needsExchangeRate || usdToIdrRate !== null;

  // =====================================================
  // CONVERT FINANCE ITEMS
  // =====================================================

  const convertedFinanceItems = useMemo(() => {
    if (!isCurrencyConversionReady) {
      return {
        incomeItems: [],
        expenseItems: [],
        loanItems: [],
      };
    }

    const rate = usdToIdrRate ?? 1;

    // =================================================
    // INCOME
    // =================================================

    const convertedIncomeItems = incomeItems.map((item) => ({
      ...item,

      amount: convertCurrency(
        item.amount,
        item.currency,
        displayCurrency,
        rate,
      ),

      currency: displayCurrency,
    }));

    // =================================================
    // EXPENSE
    // =================================================

    const convertedExpenseItems = expenseItems.map((item) => ({
      ...item,

      amount: convertCurrency(
        item.amount,
        item.currency,
        displayCurrency,
        rate,
      ),

      currency: displayCurrency,
    }));

    // =================================================
    // LOAN
    // =================================================

    const convertedLoanItems = loanItems.map((item) => ({
      ...item,

      principalAmount: convertCurrency(
        item.principalAmount,
        item.currency,
        displayCurrency,
        rate,
      ),

      remainingBalance: convertCurrency(
        item.remainingBalance,
        item.currency,
        displayCurrency,
        rate,
      ),

      monthlyPayment: convertCurrency(
        item.monthlyPayment,
        item.currency,
        displayCurrency,
        rate,
      ),

      currency: displayCurrency,
    }));

    return {
      incomeItems: convertedIncomeItems,

      expenseItems: convertedExpenseItems,

      loanItems: convertedLoanItems,
    };
  }, [
    incomeItems,
    expenseItems,
    loanItems,

    displayCurrency,
    usdToIdrRate,

    isCurrencyConversionReady,
  ]);

  return {
    ...convertedFinanceItems,

    displayCurrency,
    usdToIdrRate,

    needsExchangeRate,
    isCurrencyConversionReady,

    isExchangeRateLoading,
    exchangeRateError,
  };
}
