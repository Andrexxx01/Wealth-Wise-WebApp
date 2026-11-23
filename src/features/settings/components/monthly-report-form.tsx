"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { buildMonthlyReport, renderMonthlyReport } from "@/features/settings/lib/monthly-report";

export default function MonthlyReportForm() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inFlight = useRef(false);

  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setError(""); setMessage("");
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || month.startsWith("0000")) {
      setError("Choose a valid month.");
      return;
    }
    // Open synchronously during the user click, before awaiting network work.
    const reportWindow = window.open("", "_blank");
    if (!reportWindow) {
      setError("Allow pop-ups for WealthWise, then try again.");
      return;
    }
    inFlight.current = true;
    setPending(true);
    try {
      reportWindow.opener = null;
      reportWindow.document.title = "Preparing WealthWise report";
      reportWindow.document.body.textContent = "Preparing your monthly report…";
      const response = await fetch("/api/account/export", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(response.status === 401 ? "Please sign in again to prepare a report." : "Unable to load report data. Please try again.");
      }
      const payload: unknown = await response.json();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const report = buildMonthlyReport(payload, month, timeZone);
      if (reportWindow.closed) throw new Error("The report tab was closed. Please try again.");
      reportWindow.document.open();
      reportWindow.document.write(renderMonthlyReport(report));
      reportWindow.document.close();
      reportWindow.document.getElementById("print-report")?.addEventListener("click", () => {
        reportWindow.focus(); reportWindow.print();
      });
      setMessage("Report opened in a new tab. Click Print / Save PDF, then choose Save as PDF.");
    } catch (cause) {
      if (!reportWindow.closed) reportWindow.close();
      setError(cause instanceof Error ? cause.message : "Unable to prepare the report.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <form onSubmit={prepare} className="space-y-4" aria-busy={pending}>
      <div className="max-w-xs">
        <label htmlFor="report-month" className="text-sm font-semibold text-slate-900">Report month</label>
        <input id="report-month" type="month" value={month} required min="0001-01" max="9999-12" disabled={pending}
          onChange={(event) => { setMonth(event.target.value); setMessage(""); setError(""); }}
          className="mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900" />
      </div>
      <p id="report-help" className="max-w-3xl text-sm leading-6 text-slate-500">
        Income and expenses for the selected month, using your device timezone and original currencies.
        Opens an A4 report in a new tab. Save it as PDF from the print dialog.
      </p>
      <Button type="submit" disabled={pending || !month} aria-describedby="report-help"
        className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
        {pending ? "Preparing report…" : "Open monthly report"}
      </Button>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {message && <p role="status" className="text-sm text-emerald-600">{message}</p>}
    </form>
  );
}
