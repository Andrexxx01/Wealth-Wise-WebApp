import type { MonthlyFinancialReport, MonthlyReportRow, MonthlyReportTotal } from "@/types/financial-report";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAmount(value: unknown): bigint {
  if (typeof value !== "string" || !/^-?\d+(?:\.\d{1,2})?$/.test(value)) {
    throw new Error("Invalid amount in report data.");
  }
  const negative = value.startsWith("-");
  const [whole, fraction = ""] = value.replace(/^-/, "").split(".");
  const minor = BigInt(whole) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
  return negative ? -minor : minor;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function buildMonthlyReport(payload: unknown, month: string, timeZone: string): MonthlyFinancialReport {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || month.startsWith("0000")) {
    throw new Error("Choose a valid month.");
  }
  if (!isRecord(payload) || payload.application !== "WealthWise" || payload.schemaVersion !== 1 || !isRecord(payload.data)) {
    throw new Error("Unexpected report data. Please refresh and try again.");
  }
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  });
  function readRows(values: unknown, dateField: string): MonthlyReportRow[] {
    if (!Array.isArray(values)) throw new Error("Missing financial records.");
    const rows: MonthlyReportRow[] = [];
    for (const value of values) {
      if (!isRecord(value) || typeof value[dateField] !== "string") throw new Error("Invalid report record.");
      const date = new Date(value[dateField] as string);
      if (!Number.isFinite(date.getTime())) throw new Error("Invalid record date.");
      const parts = formatter.formatToParts(date);
      const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
      const calendarDate = `${part("year")}-${part("month")}-${part("day")}`;
      if (calendarDate.slice(0, 7) !== month) continue;
      const currency = text(value.currency);
      if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Invalid record currency.");
      rows.push({ date: calendarDate, title: text(value.title), category: text(value.category),
        notes: text(value.notes), currency, amount: parseAmount(value.amount) });
    }
    return rows.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  }
  const incomes = readRows(payload.data.incomes, "receivedAt");
  const expenses = readRows(payload.data.expenses, "spentAt");
  const byCurrency = new Map<string, MonthlyReportTotal>();
  for (const [kind, rows] of [["income", incomes], ["expenses", expenses]] as const) {
    for (const row of rows) {
      const total = byCurrency.get(row.currency) ?? {
        currency: row.currency, income: BigInt(0), expenses: BigInt(0), surplus: BigInt(0),
      };
      total[kind] += row.amount;
      total.surplus = total.income - total.expenses;
      byCurrency.set(row.currency, total);
    }
  }
  const monthLabel = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", year: "numeric" })
    .format(new Date(`${month}-01T12:00:00Z`));
  return { month, monthLabel, timeZone, incomes, expenses,
    totals: [...byCurrency.values()].sort((a, b) => a.currency.localeCompare(b.currency)) };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

function money(amount: bigint): string {
  const absolute = amount < BigInt(0) ? -amount : amount;
  const whole = (absolute / BigInt(100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${amount < BigInt(0) ? "-" : ""}${whole}.${(absolute % BigInt(100)).toString().padStart(2, "0")}`;
}

export function renderMonthlyReport(report: MonthlyFinancialReport): string {
  function table(label: string, rows: MonthlyReportRow[]): string {
    if (rows.length === 0) return `<section><h2>${label}</h2><p class="empty">No ${label.toLowerCase()} recorded for this month.</p></section>`;
    return `<section><h2>${label} <span>${rows.length} records</span></h2>
      <table class="details"><colgroup><col style="width:16%"><col style="width:49%"><col style="width:10%"><col style="width:25%"></colgroup>
      <thead><tr><th>Date</th><th>Description</th><th>Currency</th><th class="amount">Amount</th></tr></thead><tbody>
      ${rows.map((row) => `<tr><td>${escapeHtml(row.date)}</td><td><strong>${escapeHtml(row.title || "Untitled")}</strong><div class="category">${escapeHtml(row.category)}</div>${row.notes ? `<div class="notes">${escapeHtml(row.notes)}</div>` : ""}</td><td>${escapeHtml(row.currency)}</td><td class="amount">${money(row.amount)}</td></tr>`).join("")}
      </tbody></table></section>`;
  }
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>WealthWise-${escapeHtml(report.month)}-cash-flow</title>
    <style>
      @page { size: A4 portrait; margin: 16mm; }
      * { box-sizing: border-box; }
      body { margin:0; background:#f1f5f9; color:#152332; font:12px/1.5 Arial, sans-serif; }
      main { max-width: 850px; margin:24px auto; padding:40px; background:white; }
      .toolbar { max-width:850px; margin:20px auto; padding:0 16px; display:flex; align-items:center; gap:16px; }
      button { border:0; border-radius:8px; padding:12px 18px; background:#047857; color:white; font-weight:700; cursor:pointer; }
      h1 { font-size:28px; line-height:1.2; margin:6px 0 10px; }
      h2 { margin:28px 0 10px; font-size:17px; break-after:avoid; }
      h2 span { font-size:11px; font-weight:400; color:#475569; }
      .brand { color:#047857; font-size:15px; font-weight:700; letter-spacing:.06em; }
      .period { color:#475569; margin-bottom:24px; }
      .scope { border-left:3px solid #047857; background:#f8fafc; padding:12px 14px; margin:20px 0; }
      table { width:100%; border-collapse:collapse; table-layout:fixed; }
      th { color:#334155; background:#f1f5f9; font-size:11px; text-align:left; }
      th, td { padding:10px 8px; border-bottom:1px solid #dbe3e9; vertical-align:top; overflow-wrap:anywhere; }
      .amount { text-align:right; font-variant-numeric:tabular-nums; }
      .category, .notes { color:#475569; font-size:11px; margin-top:3px; }
      .notes { white-space:pre-wrap; }
      .empty { padding:16px; border:1px dashed #cbd5e1; color:#475569; }
      .report-footer { color:#64748b; border-top:1px solid #dbe3e9; padding-top:12px; margin-top:28px; font-size:10px; }
      thead { display:table-header-group; }
      tr { break-inside:avoid; }
      @media print { body { background:white; } main { max-width:none; margin:0; padding:0; } .toolbar { display:none; } }
      @media screen and (max-width:600px) { main { margin:0; padding:20px 12px; } th,td { padding:8px 4px; } h1 { font-size:24px; } }
    </style></head><body>
    <div class="toolbar"><button id="print-report" type="button">Print / Save PDF</button><span>Choose Save as PDF in the print dialog.</span></div>
    <main><div class="brand">WEALTHWISE</div><h1>Monthly cash flow</h1>
    <div class="period">${escapeHtml(report.monthLabel)} | Calendar timezone: ${escapeHtml(report.timeZone)}</div>
    <div class="scope">Recorded income and expenses only. Investment activity, investment income events, and loan movements are excluded unless separately recorded as income or expenses. Amounts stay in their original currencies; totals are not combined across currencies.</div>
    <h2>Summary by currency</h2>
    ${report.totals.length ? `<table><colgroup><col style="width:16%"><col style="width:28%"><col style="width:28%"><col style="width:28%"></colgroup><thead><tr><th>Currency</th><th class="amount">Income</th><th class="amount">Expenses</th><th class="amount">Surplus / deficit</th></tr></thead><tbody>${report.totals.map((total) => `<tr><td>${escapeHtml(total.currency)}</td><td class="amount">${money(total.income)}</td><td class="amount">${money(total.expenses)}</td><td class="amount">${money(total.surplus)}</td></tr>`).join("")}</tbody></table>` : '<p class="empty">No income or expenses recorded for this month.</p>'}
    ${table("Income", report.incomes)}${table("Expenses", report.expenses)}
    <div class="report-footer">Prepared from recorded WealthWise data. This report is not a bank statement. Dates follow the timezone shown above.</div>
    </main></body></html>`;
}
