"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DataExport() {
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
      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") ?? "";
      const fileName = disposition.match(/filename="(wealthwise-financial-data-\d{4}-\d{2}-\d{2}\.json)"/)?.[1]
        ?? "wealthwise-financial-data.json";
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
      <p id="export-help" className="max-w-3xl text-sm leading-6 text-slate-500">
        Includes all dates and open or closed investments in their original currencies.
        Live market quotes are excluded. Import and automatic restore are not yet available.
      </p>
      <Button type="button" onClick={download} disabled={pending} aria-describedby="export-help"
        className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
        {pending ? "Preparing export…" : "Download JSON"}
      </Button>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {message && <p role="status" className="text-sm text-emerald-600">{message}</p>}
    </div>
  );
}
