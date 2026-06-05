"use client";

import { useMemo } from "react";
import { useFinance } from "@/features/finance/components/finance-provider";
import {
  buildRecentFinancialActivity,
  calculateDebtToIncomeRatio,
  calculateEssentialSpending,
  calculateExtraIncome,
  calculateInvestmentReturnRate,
  calculateLifestyleSpending,
  calculateMonthlyLoanPayment,
  calculateMonthlySurplus,
  calculateNetGain,
  calculateNetWorth,
  calculatePortfolioValue,
  calculateProjectedAnnualIncome,
  calculateRecurringIncome,
  calculateSavingsRate,
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateTotalInvested,
  calculateTotalLoanBalance,
  calculateTotalPaidOff,
} from "@/lib/finance-calculations";

export function useFinanceSummary() {
  const { incomeItems, expenseItems, investmentItems, loanItems } =
    useFinance();

  return useMemo(() => {
    const totalIncome = calculateTotalIncome(incomeItems);
    const recurringIncome = calculateRecurringIncome(incomeItems);
    const extraIncome = calculateExtraIncome(totalIncome, recurringIncome);
    const projectedAnnualIncome = calculateProjectedAnnualIncome(totalIncome);

    const totalExpenses = calculateTotalExpenses(expenseItems);
    const essentialSpending = calculateEssentialSpending(expenseItems);
    const lifestyleSpending = calculateLifestyleSpending(expenseItems);

    const monthlySurplus = calculateMonthlySurplus(totalIncome, totalExpenses);

    const savingsRate = calculateSavingsRate(totalIncome, monthlySurplus);

    const portfolioValue = calculatePortfolioValue(investmentItems);
    const totalInvested = calculateTotalInvested(investmentItems);
    const netGain = calculateNetGain(portfolioValue, totalInvested);

    const investmentReturnRate = calculateInvestmentReturnRate(
      netGain,
      totalInvested,
    );

    const totalLoanBalance = calculateTotalLoanBalance(loanItems);
    const monthlyLoanPayment = calculateMonthlyLoanPayment(loanItems);
    const totalPaidOff = calculateTotalPaidOff(loanItems);

    const debtToIncomeRatio = calculateDebtToIncomeRatio(
      monthlyLoanPayment,
      totalIncome,
    );

    const netWorth = calculateNetWorth({
      monthlySurplus,
      portfolioValue,
      totalLoanBalance,
    });

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
      portfolioValue,
      totalInvested,
      netGain,
      investmentReturnRate,
      totalLoanBalance,
      monthlyLoanPayment,
      totalPaidOff,
      debtToIncomeRatio,
      netWorth,
      recentActivity,
    };
  }, [incomeItems, expenseItems, investmentItems, loanItems]);
}
