"use client";

import { useMemo } from "react";
import { useCurrentUser } from "@/features/auth/components/current-user-provider";
import { useFinance } from "@/features/finance/components/finance-provider";
import { useExchangeRate } from "@/features/currency/hooks/use-exchange-rate";
import { convertCurrency } from "@/lib/currency-conversion";

export function useConvertedFinanceItems() {
  const { currentUser } = useCurrentUser();

  const { incomeItems, expenseItems, investmentItems, loanItems } =
    useFinance();

  const { usdToIdrRate, isExchangeRateLoading, exchangeRateError } =
    useExchangeRate();

  const displayCurrency = currentUser.currency;

  const needsExchangeRate = useMemo(() => {
    return (
      incomeItems.some((item) => item.currency !== displayCurrency) ||
      expenseItems.some((item) => item.currency !== displayCurrency) ||
      investmentItems.some((item) => item.currency !== displayCurrency) ||
      loanItems.some((item) => item.currency !== displayCurrency)
    );
  }, [incomeItems, expenseItems, investmentItems, loanItems, displayCurrency]);

  const isCurrencyConversionReady = !needsExchangeRate || usdToIdrRate !== null;

  const convertedFinanceItems = useMemo(() => {
    if (!isCurrencyConversionReady) {
      return {
        incomeItems: [],
        expenseItems: [],
        investmentItems: [],
        loanItems: [],
      };
    }

    const rate = usdToIdrRate ?? 1;

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

    const convertedInvestmentItems = investmentItems.map((item) => ({
      ...item,

      investedAmount: convertCurrency(
        item.investedAmount,
        item.currency,
        displayCurrency,
        rate,
      ),

      currentValue: convertCurrency(
        item.currentValue,
        item.currency,
        displayCurrency,
        rate,
      ),

      currency: displayCurrency,
    }));

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
      investmentItems: convertedInvestmentItems,
      loanItems: convertedLoanItems,
    };
  }, [
    incomeItems,
    expenseItems,
    investmentItems,
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
