"use client";

import { useMemo } from "react";

import { useFinance } from "@/features/finance/components/finance-provider";
import { useConvertedFinanceItems } from "@/features/finance/hooks/use-converted-finance-items";

import {
  buildRecentFinancialActivity,
  calculateAvailableCash,
  calculateDebtToIncomeRatio,
  calculateEssentialSpending,
  calculateExtraIncome,
  calculateFinancialHealthScore,
  calculateLifestyleSpending,
  calculateMonthlyLoanPayment,
  calculateMonthlySurplus,
  calculateNetWorth,
  calculateProjectedAnnualIncome,
  calculateRecurringIncome,
  calculateSavingsRate,
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateTotalLoanBalance,
  calculateTotalPaidOff,
} from "@/lib/finance-calculations";

import { convertCurrencyWithUsdRates } from "@/lib/currency-conversion";
import { filterItemsByReferenceMonth } from "@/lib/finance-period";

import type { UserCurrency } from "@/types/user-subscription";

function convertInvestmentV2Amount({
  amount,
  currencyCode,
  displayCurrency,
  fxRates,
}: {
  amount: number;
  currencyCode: string | null;
  displayCurrency: UserCurrency;
  fxRates: Record<string, number> | null;
}) {
  if (!currencyCode || fxRates === null) {
    return null;
  }

  return convertCurrencyWithUsdRates({
    amount,
    fromCurrency: currencyCode,
    toCurrency: displayCurrency,
    usdRates: fxRates,
  });
}

export function useFinanceSummary() {
  /*
   * Income, expense dan loan masih menggunakan
   * conversion hook existing.
   *
   * Investment sudah sepenuhnya menggunakan
   * Investment V2 pipeline.
   */
  const {
    incomeItems,
    expenseItems,
    loanItems,

    displayCurrency,
    usdToIdrRate,

    isCurrencyConversionReady,
    isExchangeRateLoading,
    exchangeRateError,
  } = useConvertedFinanceItems();

  /*
   * Investment source of truth sekarang V2.
   */
  const {
    investmentPortfolioV2,
    investmentTransactionsV2,
    investmentContributionsV2,

    isInvestmentPortfolioV2Loading,
    investmentPortfolioV2Error,

    isInvestmentTransactionsV2Loading,
    investmentTransactionsV2Error,

    isInvestmentContributionsV2Loading,
    investmentContributionsV2Error,
  } = useFinance();

  return useMemo(() => {
    /*
     * =========================================================
     * INCOME
     * =========================================================
     */

    const monthlyIncomeItems = filterItemsByReferenceMonth(
      incomeItems,
      (item) => item.receivedAt,
    );

    const totalIncome = calculateTotalIncome(monthlyIncomeItems);

    const recurringIncome = calculateRecurringIncome(monthlyIncomeItems);

    const extraIncome = calculateExtraIncome(totalIncome, recurringIncome);

    const projectedAnnualIncome = calculateProjectedAnnualIncome(totalIncome);

    /*
     * =========================================================
     * EXPENSES
     * =========================================================
     */

    const monthlyExpenseItems = filterItemsByReferenceMonth(
      expenseItems,
      (item) => item.spentAt,
    );

    const totalExpenses = calculateTotalExpenses(monthlyExpenseItems);

    const essentialSpending = calculateEssentialSpending(monthlyExpenseItems);

    const lifestyleSpending = calculateLifestyleSpending(monthlyExpenseItems);

    /*
     * =========================================================
     * BASIC CASH FLOW
     * =========================================================
     */

    const monthlySurplus = calculateMonthlySurplus(totalIncome, totalExpenses);

    const savingsRate = calculateSavingsRate(totalIncome, monthlySurplus);

    /*
     * =========================================================
     * INVESTMENT V2 BASE DATA
     * =========================================================
     */

    const portfolioSummary = investmentPortfolioV2?.summary ?? null;

    /*
     * Portfolio API sudah selesai dan response
     * berhasil diterima.
     *
     * READY tidak berarti semua asset pasti
     * memiliki market price.
     */
    const isPortfolioValuationReady =
      !isInvestmentPortfolioV2Loading &&
      !investmentPortfolioV2Error &&
      portfolioSummary !== null;

    /*
     * COMPLETE berarti semua asset berhasil
     * mendapatkan valuation.
     *
     * Ini penting terutama untuk Net Worth.
     */
    const isPortfolioValuationComplete =
      isPortfolioValuationReady && portfolioSummary.unvaluedAssets === 0;

    /*
     * Portfolio V2 endpoint sudah menyediakan
     * exchange rate yang dipakai oleh valuation.
     *
     * Gunakan rate yang sama untuk investment
     * supaya perhitungan investment konsisten.
     */
    const investmentFxRates =
      investmentPortfolioV2?.meta.fxRates.rates ?? null;

    /*
     * =========================================================
     * TOTAL INVESTED
     * =========================================================
     *
     * Total Invested:
     *
     * seluruh gross BUY + OPEN
     *
     * Fee TIDAK dimasukkan karena fee ditampilkan
     * secara terpisah sebagai investment fee.
     *
     * Contoh:
     *
     * BUY BTC
     * gross = Rp1.350.000
     * fee   = Rp2.793
     *
     * totalInvested = Rp1.350.000
     */

    let convertedTotalInvested = 0;

    let isInvestmentContributionConversionReady = true;

    for (const contribution of investmentContributionsV2) {
      const convertedAmount = convertInvestmentV2Amount({
        amount: contribution.grossAmount,

        currencyCode: contribution.currencyCode,

        displayCurrency,

        fxRates: investmentFxRates,
      });

      if (convertedAmount === null) {
        isInvestmentContributionConversionReady = false;

        continue;
      }

      convertedTotalInvested += convertedAmount;
    }

    const isInvestmentContributionDataReady =
      !isInvestmentContributionsV2Loading && !investmentContributionsV2Error;

    const isTotalInvestedReady =
      isInvestmentContributionDataReady &&
      isInvestmentContributionConversionReady;

    /*
     * Numeric fallback internal = 0.
     *
     * Nanti UI dapat menggunakan readiness flag
     * bila ingin menampilkan em dash ketika
     * conversion belum tersedia.
     */
    const totalInvested = isTotalInvestedReady ? convertedTotalInvested : 0;

    /*
     * =========================================================
     * INVESTMENT FEES
     * =========================================================
     *
     * Portfolio Summary V2 sudah menghitung
     * fee seluruh transaction:
     *
     * BUY
     * SELL
     * OPEN
     * CLOSE
     */

    const totalInvestmentFees = isPortfolioValuationReady
      ? portfolioSummary.totalFeesInDisplayCurrency
      : 0;

    /*
     * =========================================================
     * INVESTMENT COST BASIS
     * =========================================================
     *
     * Ini bukan historical Total Invested.
     *
     * Cost Basis adalah remaining basis
     * dari posisi yang masih dimiliki.
     */

    const investmentCostBasis = isPortfolioValuationReady
      ? portfolioSummary.totalCostBasis
      : 0;

    /*
     * =========================================================
     * NET INVESTMENT CASH FLOW
     * =========================================================
     *
     * Holding Engine menggunakan:
     *
     * BUY
     * -(gross + fee)
     *
     * SELL
     * +(gross - fee)
     *
     * OPEN
     * -(gross + fee)
     *
     * CLOSE
     * +(gross - fee)
     *
     * Untuk metrik monthly, kita hitung ulang cash flow
     * hanya dari transaction pada bulan berjalan agar
     * periodenya konsisten dengan income dan expense.
     */

    const monthlyInvestmentTransactions = filterItemsByReferenceMonth(
      investmentTransactionsV2,
      (transaction) => transaction.transactedAt,
    );

    let netInvestmentTransactionCashFlow = 0;

    let isInvestmentCashFlowConversionReady = true;

    for (const transaction of monthlyInvestmentTransactions) {
      const signedCashFlow =
        transaction.type === "BUY" || transaction.type === "OPEN"
          ? -(transaction.grossAmount + transaction.feeAmount)
          : transaction.grossAmount - transaction.feeAmount;

      const convertedCashFlow = convertInvestmentV2Amount({
        amount: signedCashFlow,

        currencyCode: transaction.currencyCode,

        displayCurrency,

        fxRates: investmentFxRates,
      });

      if (convertedCashFlow === null) {
        isInvestmentCashFlowConversionReady = false;

        continue;
      }

      netInvestmentTransactionCashFlow += convertedCashFlow;
    }

    const isInvestmentTransactionDataReady =
      !isInvestmentTransactionsV2Loading && !investmentTransactionsV2Error;

    const isInvestmentCashFlowReady =
      isInvestmentTransactionDataReady && isInvestmentCashFlowConversionReady;

    /*
     * netTransactionCashFlow memakai:
     *
     * negative = cash keluar
     * positive = cash masuk
     *
     * calculateAvailableCash() membutuhkan:
     *
     * positive = cash outflow
     *
     * Maka tandanya kita balik.
     *
     * Contoh:
     *
     * BUY = -1.000
     *
     * totalInvestmentCashOutflow
     * = 1.000
     *
     *
     * Jika pada bulan yang sama kemudian SELL
     * menghasilkan +400:
     *
     * net monthly cash flow = -600
     * cash outflow bersih   = 600
     */

    const totalInvestmentCashOutflow = isInvestmentCashFlowReady
      ? -netInvestmentTransactionCashFlow
      : 0;

    /*
     * =========================================================
     * PORTFOLIO VALUE
     * =========================================================
     *
     * Jika sebagian asset belum punya valuation,
     * totalMarketValue bersifat PARTIAL.
     *
     * Kita tetap mempertahankan angkanya.
     * isPortfolioValuationComplete digunakan
     * untuk mengetahui apakah valuation lengkap.
     */

    const portfolioValue = isPortfolioValuationReady
      ? portfolioSummary.totalMarketValue
      : 0;

    /*
     * =========================================================
     * INVESTMENT GAIN
     * =========================================================
     *
     * V2:
     *
     * totalGainLoss
     * =
     * realized gain/loss
     * +
     * unrealized gain/loss
     *
     * Jangan lagi menghitung:
     *
     * portfolioValue - totalInvested
     *
     * karena rumus itu rusak setelah SELL.
     */

    const netGain = isPortfolioValuationReady
      ? portfolioSummary.totalGainLoss
      : 0;

    /*
     * Return % sekarang menggunakan
     * unrealized return untuk posisi terbuka.
     *
     * Ini sengaja.
     *
     * Full portfolio return setelah terdapat
     * BUY/SELL/deposit/withdrawal nantinya
     * sebaiknya menggunakan:
     *
     * - TWR
     * atau
     * - MWRR / XIRR
     *
     * Jadi jangan membuat total-return palsu
     * hanya dengan netGain / remainingCostBasis.
     */

    const investmentReturnRate = isPortfolioValuationReady
      ? (portfolioSummary.unrealizedReturnPercentage ?? 0)
      : 0;

    /*
     * =========================================================
     * AVAILABLE CASH
     * =========================================================
     *
     * Income
     * - Expense
     * - net investment cash outflow
     *
     * Karena SELL / CLOSE dapat menghasilkan
     * cash inflow, nilainya sudah ikut
     * diperhitungkan.
     */

    const availableCash = isInvestmentCashFlowReady
      ? calculateAvailableCash(monthlySurplus, totalInvestmentCashOutflow)
      : 0;

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
     *
     * Net worth tidak boleh dianggap final
     * jika terdapat asset investment yang
     * belum berhasil divaluasi.
     */

    const isNetWorthReady =
      isCurrencyConversionReady &&
      isPortfolioValuationComplete &&
      isInvestmentCashFlowReady;

    const netWorth = isNetWorthReady
      ? calculateNetWorth({
          availableCash,
          portfolioValue,
          totalLoanBalance,
        })
      : 0;

    /*
     * =========================================================
     * FINANCIAL HEALTH
     * =========================================================
     */

    const hasMonthlyIncome = totalIncome > 0;

    const hasOpenInvestmentPosition =
      isPortfolioValuationReady && (portfolioSummary?.openAssets ?? 0) > 0;

    const financialHealthScore = calculateFinancialHealthScore({
      savingsRate,
      debtToIncomeRatio,
      monthlySurplus,
      portfolioValue,
      investmentReturnRate,
      hasMonthlyIncome,
      hasOpenInvestmentPosition,
    });

    /*
     * =========================================================
     * RECENT ACTIVITY
     * =========================================================
     *
     * Untuk sekarang Recent Activity dashboard
     * masih hanya menampilkan:
     *
     * Income + Expense.
     *
     * Investment transaction dapat kita
     * integrasikan pada tahap berikutnya.
     */

    const recentActivity = buildRecentFinancialActivity({
      incomeItems,
      expenseItems,
      limit: 5,
    });

    return {
      /*
       * Income
       */
      totalIncome,
      recurringIncome,
      extraIncome,
      projectedAnnualIncome,
      monthlyIncomeItems,

      /*
       * Expense
       */
      totalExpenses,
      essentialSpending,
      lifestyleSpending,
      monthlyExpenseItems,

      /*
       * Basic cash flow
       */
      monthlySurplus,
      savingsRate,

      /*
       * Investment V2
       */
      totalInvested,
      totalInvestmentFees,
      totalInvestmentCashOutflow,
      investmentCostBasis,

      portfolioValue,
      netGain,
      investmentReturnRate,

      /*
       * Investment readiness
       */
      isTotalInvestedReady,
      isInvestmentCashFlowReady,

      /*
       * Cash
       */
      availableCash,

      /*
       * Loan
       */
      totalLoanBalance,
      monthlyLoanPayment,
      totalPaidOff,
      debtToIncomeRatio,

      /*
       * Net worth
       */
      netWorth,
      isNetWorthReady,

      /*
       * Health
       */
      financialHealthScore,

      /*
       * Activity
       */
      recentActivity,

      /*
       * Currency
       */
      displayCurrency,
      usdToIdrRate,

      isCurrencyConversionReady,
      isExchangeRateLoading,
      exchangeRateError,

      /*
       * Compatibility names.
       *
       * Consumer lama masih memakai nama ini.
       * Tetapi source-nya sekarang Portfolio V2.
       */
      isPortfolioValuationReady,
      isPortfolioValuationComplete,

      isMarketPriceLoading: isInvestmentPortfolioV2Loading,

      marketPriceError: investmentPortfolioV2Error,

      marketPriceAsOf: investmentPortfolioV2?.meta.marketPriceAsOf ?? null,
    };
  }, [
    incomeItems,
    expenseItems,
    loanItems,

    displayCurrency,
    usdToIdrRate,

    isCurrencyConversionReady,
    isExchangeRateLoading,
    exchangeRateError,

    investmentPortfolioV2,
    investmentTransactionsV2,
    investmentContributionsV2,

    isInvestmentPortfolioV2Loading,
    investmentPortfolioV2Error,

    isInvestmentTransactionsV2Loading,
    investmentTransactionsV2Error,

    isInvestmentContributionsV2Loading,
    investmentContributionsV2Error,
  ]);
}
