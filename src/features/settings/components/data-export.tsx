"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { buildFinancialCsv, EXPORT_COLLECTIONS, type ExportCollection } from "@/features/settings/lib/financial-csv";

export default function DataExport() {
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [collection, setCollection] = useState<ExportCollection>("incomes");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inFlight = useRef(false);

  async function download() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/account/export", { cache: "no-store" });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(response.status === 401
          ? "Please sign in again to export your data."
          : body?.message ?? "Unable to export your data.");
      }
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Unexpected response. Please sign in again and retry.");
      }
      let blob: Blob;
      const disposition = response.headers.get("content-disposition") ?? "";
      let fileName = disposition.match(/filename="(wealthwise-financial-data-\d{4}-\d{2}-\d{2}\.json)"/)?.[1]
        ?? "wealthwise-financial-data.json";
      if (format === "csv") {
        const payload: unknown = await response.json();
        blob = new Blob([buildFinancialCsv(payload, collection)], { type: "text/csv;charset=utf-8" });
        const date = fileName.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ?? new Date().toISOString().slice(0, 10);
        fileName = `wealthwise-${collection}-${date}.csv`;
      } else {
        blob = await response.blob();
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      try {
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
      } finally {
        link.remove();
        // Allow browsers time to begin reading the download before releasing it.
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
      setMessage("Download requested. Check your browser downloads.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to export your data.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <div className="space-y-4" aria-busy={pending}>
      <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="export-format" className="text-sm font-semibold text-slate-900">File format</label>
          <select id="export-format" value={format} disabled={pending}
            onChange={(event) => { setFormat(event.target.value === "csv" ? "csv" : "json"); setMessage(""); setError(""); }}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900">
            <option value="json">JSON — all financial data</option>
            <option value="csv">CSV — spreadsheet</option>
          </select>
        </div>
        {format === "csv" && <div>
          <label htmlFor="export-category" className="text-sm font-semibold text-slate-900">Data category</label>
          <select id="export-category" value={collection} disabled={pending}
            onChange={(event) => {
              const selected = EXPORT_COLLECTIONS.find((item) => item.key === event.target.value);
              if (selected) { setCollection(selected.key); setMessage(""); setError(""); }
            }}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900">
            {EXPORT_COLLECTIONS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
        </div>}
      </div>
      <p id="export-help" className="max-w-3xl text-sm leading-6 text-slate-500">
        Includes all dates and open or closed investments in their original currencies.
        {format === "csv"
          ? " CSV contains one category per file. Choose comma as the delimiter when importing. Spreadsheet apps may round long numbers; use JSON to retain exact precision."
          : " Live market quotes are excluded. Import and automatic restore are not yet available."}
      </p>
      <Button type="button" onClick={download} disabled={pending} aria-describedby="export-help"
        className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
        {pending ? "Preparing export…" : format === "csv" ? "Download CSV" : "Download JSON"}
      </Button>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {message && <p role="status" className="text-sm text-emerald-600">{message}</p>}
    </div>
  );
}
