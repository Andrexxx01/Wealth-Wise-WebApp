import { convertCurrencyWithUsdRates } from "@/lib/currency-conversion";
import type { IncomeItem } from "@/types/income";
import type { ExpenseItem } from "@/types/expense";
import type { LoanItem } from "@/types/loan";
import type { InvestmentValuationsResponse } from "@/types/investment-v2";
import type { UserCurrency } from "@/types/user-subscription";

/** Estimate from recorded activity, with a zero opening cash balance.
 * Loan records supply liabilities only; cash receipts/repayments must be
 * recorded in income/expenses. No monthly scheduled payment is deducted here.
 */
export function calculateRecordedNetWorth({
  incomeItems, expenseItems, loanItems, portfolio, displayCurrency,
}: {
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
  loanItems: LoanItem[];
  portfolio: InvestmentValuationsResponse | null;
  displayCurrency: UserCurrency;
}): { availableCash: number; netWorth: number } | null {
  if (!portfolio || portfolio.summary.displayCurrency !== displayCurrency ||
      portfolio.summary.unvaluedAssets > 0) return null;

  const rates = portfolio.meta.fxRates.rates;
  let availableCash = portfolio.summary.totalNetRealizedIncome;
  let debt = 0;
  const convert = (amount: number, currency: string | null) => {
    if (!Number.isFinite(amount)) return null;
    if (amount === 0) return 0;
    if (!currency) return null;
    return convertCurrencyWithUsdRates({
      amount, fromCurrency: currency, toCurrency: displayCurrency, usdRates: rates,
    });
  };

  for (const item of incomeItems) {
    const amount = convert(item.amount, item.currency);
    if (amount === null) return null;
    availableCash += amount;
  }
  for (const item of expenseItems) {
    const amount = convert(item.amount, item.currency);
    if (amount === null) return null;
    availableCash -= amount;
  }
  // Holdings include the complete BUY/SELL/OPEN/CLOSE history and fees,
  // including closed assets. Capital gains are not a second cash receipt.
  for (const item of portfolio.data) {
    const amount = convert(item.netTransactionCashFlow, item.transactionCurrencyCode);
    if (amount === null) return null;
    availableCash += amount;
  }
  for (const item of loanItems) {
    const amount = convert(item.remainingBalance, item.currency);
    if (amount === null) return null;
    debt += amount;
  }
  const netWorth = availableCash + portfolio.summary.totalMarketValue - debt;
  return Number.isFinite(netWorth) ? { availableCash, netWorth } : null;
}
