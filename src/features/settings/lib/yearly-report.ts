import type { MonthlyFinancialReport, MonthlyReportTotal } from "@/types/financial-report";
import { buildMonthlyReport } from "@/features/settings/lib/monthly-report";

export function buildYearlyReport(payload: unknown, year: string, timeZone: string): MonthlyFinancialReport {
  if (!/^[1-9]\d{3}$/.test(year)) throw new Error("Choose a year from 1000 to 9999.");
  const monthlyReports = Array.from({ length: 12 }, (_, index) =>
    buildMonthlyReport(payload, `${year}-${String(index + 1).padStart(2, "0")}`, timeZone));
  const byCurrency = new Map<string, MonthlyReportTotal>();
  for (const report of monthlyReports) {
    for (const total of report.totals) {
      const annual = byCurrency.get(total.currency) ?? {
        currency: total.currency, income: BigInt(0), expenses: BigInt(0), surplus: BigInt(0),
      };
      annual.income += total.income;
      annual.expenses += total.expenses;
      annual.surplus = annual.income - annual.expenses;
      byCurrency.set(total.currency, annual);
    }
  }
  return {
    periodKind: "yearly", month: year, monthLabel: year, timeZone,
    incomes: monthlyReports.flatMap((report) => report.incomes),
    expenses: monthlyReports.flatMap((report) => report.expenses),
    totals: [...byCurrency.values()].sort((a, b) => a.currency.localeCompare(b.currency)),
    monthlyTotals: monthlyReports.map((report) => ({ month: report.month, totals: report.totals })),
  };
}
