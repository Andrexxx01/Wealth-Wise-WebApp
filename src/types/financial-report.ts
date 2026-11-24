export type MonthlyReportRow = {
  date: string;
  title: string;
  category: string;
  notes: string;
  currency: string;
  amount: bigint;
};

export type MonthlyReportTotal = {
  currency: string;
  income: bigint;
  expenses: bigint;
  surplus: bigint;
};

export type ReportPeriod = "monthly" | "yearly";

export type MonthlyFinancialReport = {
  periodKind?: ReportPeriod;
  monthlyTotals?: { month: string; totals: MonthlyReportTotal[] }[];
  month: string;
  monthLabel: string;
  timeZone: string;
  incomes: MonthlyReportRow[];
  expenses: MonthlyReportRow[];
  totals: MonthlyReportTotal[];
};
