"use client";

import { useMemo } from "react";

import { useConvertedFinanceItems } from "@/features/finance/hooks/use-converted-finance-items";
import { useInvestmentMarketSummary } from "@/features/investments/hooks/use-investment-market-summary";

import {
  buildRecentFinancialActivity,
  calculateAvailableCash,
  calculateDebtToIncomeRatio,
  calculateEssentialSpending,
  calculateExtraIncome,
  calculateFinancialHealthScore,
  calculateInvestmentReturnRate,
  calculateLifestyleSpending,
  calculateMonthlyLoanPayment,
  calculateMonthlySurplus,
  calculateNetGain,
  calculateNetWorth,
  calculateProjectedAnnualIncome,
  calculateRecurringIncome,
  calculateSavingsRate,
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateTotalInvested,
  calculateTotalInvestmentCashOutflow,
  calculateTotalInvestmentFees,
  calculateTotalLoanBalance,
  calculateTotalPaidOff,
} from "@/lib/finance-calculations";

export function useFinanceSummary() {
  const {
    incomeItems,
    expenseItems,
    investmentItems,
    loanItems,
    displayCurrency,
    usdToIdrRate,
    isCurrencyConversionReady,
    isExchangeRateLoading,
    exchangeRateError,
  } = useConvertedFinanceItems();

  const {
    portfolioValue: marketPortfolioValue,
    isPortfolioValuationReady,
    isPortfolioValuationComplete,
    isMarketPriceLoading,
    marketPriceError,
    marketPriceAsOf,
  } = useInvestmentMarketSummary();

  return useMemo(() => {
    /*
     * =========================================================
     * INCOME
     * =========================================================
     */

    const totalIncome = calculateTotalIncome(incomeItems);

    const recurringIncome = calculateRecurringIncome(incomeItems);

    const extraIncome = calculateExtraIncome(totalIncome, recurringIncome);

    const projectedAnnualIncome = calculateProjectedAnnualIncome(totalIncome);

    /*
     * =========================================================
     * EXPENSES
     * =========================================================
     */

    const totalExpenses = calculateTotalExpenses(expenseItems);

    const essentialSpending = calculateEssentialSpending(expenseItems);

    const lifestyleSpending = calculateLifestyleSpending(expenseItems);

    /*
     * =========================================================
     * CASH FLOW
     * =========================================================
     */

    const monthlySurplus = calculateMonthlySurplus(totalIncome, totalExpenses);

    const savingsRate = calculateSavingsRate(totalIncome, monthlySurplus);

    /*
     * =========================================================
     * INVESTMENTS
     * =========================================================
     */

    const totalInvested = calculateTotalInvested(investmentItems);

    const totalInvestmentFees = calculateTotalInvestmentFees(investmentItems);

    const totalInvestmentCashOutflow =
      calculateTotalInvestmentCashOutflow(investmentItems);

    /*
     * Cost basis:
     *
     * invested amount + transaction fees
     */
    const investmentCostBasis = totalInvestmentCashOutflow;

    /*
     * portfolioValue hanya boleh dianggap valid jika
     * market valuation sudah lengkap dan siap.
     *
     * Angka 0 di sini hanya numeric fallback internal.
     * UI nanti harus melihat isPortfolioValuationReady.
     */
    const portfolioValue = isPortfolioValuationReady ? marketPortfolioValue : 0;

    const netGain = isPortfolioValuationReady
      ? calculateNetGain(portfolioValue, investmentCostBasis)
      : 0;

    const investmentReturnRate = isPortfolioValuationReady
      ? calculateInvestmentReturnRate(netGain, investmentCostBasis)
      : 0;

    /*
     * =========================================================
     * AVAILABLE CASH
     * =========================================================
     *
     * Income
     * - Expenses
     * - Investment Purchases
     * - Investment Fees
     */

    const availableCash = calculateAvailableCash(
      monthlySurplus,
      totalInvestmentCashOutflow,
    );

    /*
     * =========================================================
     * LOANS
     * =========================================================
     */

    const totalLoanBalance = calculateTotalLoanBalance(loanItems);

    const monthlyLoanPayment = calculateMonthlyLoanPayment(loanItems);

    const totalPaidOff = calculateTotalPaidOff(loanItems);

    const debtToIncomeRatio = calculateDebtToIncomeRatio(
      monthlyLoanPayment,
      totalIncome,
    );

    /*
     * =========================================================
     * NET WORTH
     * =========================================================
     */

    const isNetWorthReady =
      isCurrencyConversionReady && isPortfolioValuationReady;

    const netWorth = calculateNetWorth({
      availableCash,
      portfolioValue,
      totalLoanBalance,
    });

    /*
     * =========================================================
     * FINANCIAL HEALTH
     * =========================================================
     */

    const financialHealthScore = calculateFinancialHealthScore({
      savingsRate,
      debtToIncomeRatio,
      monthlySurplus,
      portfolioValue,
      investmentReturnRate,
    });

    /*
     * =========================================================
     * RECENT ACTIVITY
     * =========================================================
     */

    const recentActivity = buildRecentFinancialActivity({
      incomeItems,
      expenseItems,
      limit: 5,
    });

    return {
      totalIncome,
      recurringIncome,
      extraIncome,
      projectedAnnualIncome,

      totalExpenses,
      essentialSpending,
      lifestyleSpending,

      monthlySurplus,
      savingsRate,

      totalInvested,
      totalInvestmentFees,
      totalInvestmentCashOutflow,
      investmentCostBasis,

      portfolioValue,
      netGain,
      investmentReturnRate,

      availableCash,

      totalLoanBalance,
      monthlyLoanPayment,
      totalPaidOff,
      debtToIncomeRatio,

      netWorth,
      isNetWorthReady,

      financialHealthScore,

      recentActivity,

      displayCurrency,
      usdToIdrRate,

      isCurrencyConversionReady,
      isExchangeRateLoading,
      exchangeRateError,

      isPortfolioValuationReady,
      isPortfolioValuationComplete,
      isMarketPriceLoading,
      marketPriceError,
      marketPriceAsOf,
    };
  }, [
    incomeItems,
    expenseItems,
    investmentItems,
    loanItems,

    displayCurrency,
    usdToIdrRate,

    isCurrencyConversionReady,
    isExchangeRateLoading,
    exchangeRateError,

    marketPortfolioValue,
    isPortfolioValuationReady,
    isPortfolioValuationComplete,
    isMarketPriceLoading,
    marketPriceError,
    marketPriceAsOf,
  ]);
}
