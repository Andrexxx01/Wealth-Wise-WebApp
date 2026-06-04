import type { IncomeItem } from "@/types/income";
import type { LoanItem } from "@/types/loan";
import { EXPENSE_CATEGORY_OPTIONS } from "@/constants/finance-options";
import type { ExpenseCategory, ExpenseItem } from "@/types/expense";
import { INVESTMENT_CATEGORY_OPTIONS } from "@/constants/finance-options";
import type { InvestmentCategory, InvestmentItem } from "@/types/investment";

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

export function calculateExtraIncome(
  totalIncome: number,
  recurringIncome: number,
) {
  return totalIncome - recurringIncome;
}

export function calculateProjectedAnnualIncome(totalIncome: number) {
  return totalIncome * 12;
}

export function sortRecentIncomeItems(incomeItems: IncomeItem[], limit = 4) {
  return [...incomeItems]
    .sort((a, b) => {
      return (
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
      );
    })
    .slice(0, limit);
}

export function calculateLifestyleSpending(expenseItems: ExpenseItem[]) {
  return expenseItems
    .filter((item) => item.type === "LIFESTYLE")
    .reduce((total, item) => total + item.amount, 0);
}

export function calculateAverageDailySpend(totalExpenses: number, days = 30) {
  if (days <= 0) return 0;

  return totalExpenses / days;
}

export function buildExpenseCategoryBreakdown({
  expenseItems,
  totalExpenses,
  limit = 5,
}: {
  expenseItems: ExpenseItem[];
  totalExpenses: number;
  limit?: number;
}) {
  return EXPENSE_CATEGORY_OPTIONS.map((option) => {
    const amount = expenseItems
      .filter((item) => item.category === option.value)
      .reduce((total, item) => total + item.amount, 0);

    const percentage =
      totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;

    return {
      name: option.label,
      category: option.value as ExpenseCategory,
      amount,
      percentage,
    };
  })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export function sortRecentExpenseItems(expenseItems: ExpenseItem[], limit = 5) {
  return [...expenseItems]
    .sort((a, b) => {
      return new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime();
    })
    .slice(0, limit);
}

export function calculateInvestmentReturnRate(
  netGain: number,
  totalInvested: number,
) {
  if (totalInvested <= 0) return 0;

  return (netGain / totalInvested) * 100;
}

export function buildPortfolioAllocation({
  investmentItems,
  portfolioValue,
  limit = 5,
}: {
  investmentItems: InvestmentItem[];
  portfolioValue: number;
  limit?: number;
}) {
  return INVESTMENT_CATEGORY_OPTIONS.map((option) => {
    const amount = investmentItems
      .filter((item) => item.category === option.value)
      .reduce((total, item) => total + item.currentValue, 0);

    const percentage =
      portfolioValue > 0 ? Math.round((amount / portfolioValue) * 100) : 0;

    return {
      name: option.label,
      category: option.value as InvestmentCategory,
      amount,
      percentage,
    };
  })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export function buildInvestmentHoldings(investmentItems: InvestmentItem[]) {
  return investmentItems.map((item) => {
    const gain = item.currentValue - item.investedAmount;

    const gainPercentage =
      item.investedAmount > 0 ? (gain / item.investedAmount) * 100 : 0;

    return {
      id: item.id,
      asset: item.assetName,
      category: item.category,
      currentValue: item.currentValue,
      gainPercentage,
    };
  });
}