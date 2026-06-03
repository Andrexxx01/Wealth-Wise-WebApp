import type { ExpenseItem } from "@/types/expense";
import type { IncomeItem } from "@/types/income";
import type { InvestmentItem } from "@/types/investment";
import type { LoanItem } from "@/types/loan";

export type FinanceActivityItem = {
  id: string;
  title: string;
  type: "Income" | "Expense";
  amount: number;
  date: string;
};

export function calculateTotalIncome(incomeItems: IncomeItem[]) {
  return incomeItems.reduce((total, item) => total + item.amount, 0);
}

export function calculateRecurringIncome(incomeItems: IncomeItem[]) {
  return incomeItems
    .filter((item) => item.frequency !== "ONE_TIME")
    .reduce((total, item) => total + item.amount, 0);
}

export function calculateTotalExpenses(expenseItems: ExpenseItem[]) {
  return expenseItems.reduce((total, item) => total + item.amount, 0);
}

export function calculateEssentialSpending(expenseItems: ExpenseItem[]) {
  return expenseItems
    .filter((item) => item.type === "ESSENTIAL")
    .reduce((total, item) => total + item.amount, 0);
}

export function calculateMonthlySurplus(
  totalIncome: number,
  totalExpenses: number,
) {
  return totalIncome - totalExpenses;
}

export function calculateSavingsRate(
  totalIncome: number,
  monthlySurplus: number,
) {
  if (totalIncome <= 0) return 0;

  return (monthlySurplus / totalIncome) * 100;
}

export function calculatePortfolioValue(investmentItems: InvestmentItem[]) {
  return investmentItems.reduce((total, item) => total + item.currentValue, 0);
}

export function calculateTotalInvested(investmentItems: InvestmentItem[]) {
  return investmentItems.reduce(
    (total, item) => total + item.investedAmount,
    0,
  );
}

export function calculateNetGain(
  portfolioValue: number,
  totalInvested: number,
) {
  return portfolioValue - totalInvested;
}

export function calculateTotalLoanBalance(loanItems: LoanItem[]) {
  return loanItems.reduce((total, item) => total + item.remainingBalance, 0);
}

export function calculateMonthlyLoanPayment(loanItems: LoanItem[]) {
  return loanItems.reduce((total, item) => total + item.monthlyPayment, 0);
}

export function calculateTotalPaidOff(loanItems: LoanItem[]) {
  return loanItems.reduce((total, item) => {
    const paidAmount = item.principalAmount - item.remainingBalance;

    return total + Math.max(paidAmount, 0);
  }, 0);
}

export function calculateDebtToIncomeRatio(
  monthlyPaymentTotal: number,
  monthlyIncome: number,
) {
  if (monthlyIncome <= 0) return 0;

  return (monthlyPaymentTotal / monthlyIncome) * 100;
}

export function calculateNetWorth({
  monthlySurplus,
  portfolioValue,
  totalLoanBalance,
}: {
  monthlySurplus: number;
  portfolioValue: number;
  totalLoanBalance: number;
}) {
  return monthlySurplus + portfolioValue - totalLoanBalance;
}

export function buildRecentFinancialActivity({
  incomeItems,
  expenseItems,
  limit = 5,
}: {
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
  limit?: number;
}): FinanceActivityItem[] {
  const recentIncome = incomeItems.map((item) => ({
    id: item.id,
    title: item.title,
    type: "Income" as const,
    amount: item.amount,
    date: item.receivedAt,
  }));

  const recentExpenses = expenseItems.map((item) => ({
    id: item.id,
    title: item.title,
    type: "Expense" as const,
    amount: -item.amount,
    date: item.spentAt,
  }));

  return [...recentIncome, ...recentExpenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
