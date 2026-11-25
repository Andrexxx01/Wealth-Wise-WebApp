"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EXPENSE_CATEGORY_OPTIONS } from "@/constants/finance-options";
import { useCurrentUser } from "@/features/auth/components/current-user-provider";
import { useFinance } from "@/features/finance/components/finance-provider";
import { calculateBudgetUsage } from "@/features/budgets/lib/budget-usage";
import { isBudgetMonth, parseBudgetPayload } from "@/features/budgets/lib/budget-validation";
import { formatCurrency } from "@/lib/formatters";
import type { BudgetItem, BudgetUsage } from "@/types/budget";
import type { ExpenseCategory } from "@/types/expense";
import type { UserCurrency } from "@/types/user-subscription";

const controlClass = "mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 disabled:opacity-60";

function BudgetMonth({ month, onBusy, onRetry }: { month: string; onBusy: (value: boolean) => void; onRetry: () => void }) {
  const { currentUser } = useCurrentUser();
  const { expenseItems, isExpenseLoading, expenseError } = useFinance();
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [category, setCategory] = useState<ExpenseCategory>("FOOD");
  const [currency, setCurrency] = useState<UserCurrency>(currentUser.currency);
  const [amount, setAmount] = useState("");
  const inFlight = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/budgets?month=${encodeURIComponent(month)}`, { cache: "no-store", signal: controller.signal });
        const body = await response.json();
        if (!response.ok || !Array.isArray(body.data)) throw new Error(body.message ?? "Unable to load budgets.");
        if (!controller.signal.aborted) setBudgets(body.data);
      } catch (cause) {
        if (!controller.signal.aborted) setLoadError(cause instanceof Error ? cause.message : "Unable to load budgets.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [month]);

  function resetForm() {
    setEditing(null); setCategory("FOOD"); setCurrency(currentUser.currency); setAmount("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setError(""); setMessage("");
    let payload;
    try { payload = parseBudgetPayload({ month, category, currency, amount }); } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Check your budget details."); return;
    }
    inFlight.current = true; setPending(true); onBusy(true);
    try {
      const response = await fetch("/api/budgets", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok || !body.data) throw new Error(body.message ?? "Unable to save budget.");
      const saved: BudgetItem = body.data;
      setBudgets((rows) => [...rows.filter((row) => row.id !== saved.id), saved]
        .sort((a, b) => a.category.localeCompare(b.category) || a.currency.localeCompare(b.currency)));
      resetForm(); setMessage("Budget saved.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save budget.");
    } finally { inFlight.current = false; setPending(false); onBusy(false); }
  }

  async function remove(budget: BudgetItem) {
    if (inFlight.current || !window.confirm("Delete this budget? Recorded expenses will remain unchanged.")) return;
    inFlight.current = true; setPending(true); onBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/budgets/${encodeURIComponent(budget.id)}`, { method: "DELETE" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? "Unable to delete budget.");
      setBudgets((rows) => rows.filter((row) => row.id !== budget.id));
      if (editing === budget.id) resetForm();
      setMessage("Budget deleted. Your expenses are unchanged.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete budget."); }
    finally { inFlight.current = false; setPending(false); onBusy(false); }
  }

  if (loading) return <p role="status" className="text-sm text-slate-500">Loading budgets…</p>;
  if (loadError) return <div className="space-y-3"><p role="alert" className="text-sm text-red-600">{loadError}</p><Button type="button" variant="outline" onClick={onRetry}>Retry</Button></div>;
  const usageReady = !isExpenseLoading && !expenseError;
  return (
    <div className="space-y-6">
      <form onSubmit={save} className="space-y-4" aria-busy={pending}>
        <h3 className="font-bold text-slate-900">{editing ? "Edit budget amount" : "Set category budget"}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div><label htmlFor="budget-category" className="text-sm font-semibold text-slate-900">Category</label>
            <select id="budget-category" value={category} disabled={pending || !!editing} className={controlClass}
              onChange={(event) => { const selected = EXPENSE_CATEGORY_OPTIONS.find((item) => item.value === event.target.value); if (selected) setCategory(selected.value); }}>
              {EXPENSE_CATEGORY_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select></div>
          <div><label htmlFor="budget-currency" className="text-sm font-semibold text-slate-900">Currency</label>
            <select id="budget-currency" value={currency} disabled={pending || !!editing} className={controlClass}
              onChange={(event) => setCurrency(event.target.value === "IDR" ? "IDR" : "USD")}>
              <option value="IDR">IDR</option><option value="USD">USD</option>
            </select></div>
          <div><label htmlFor="budget-amount" className="text-sm font-semibold text-slate-900">Monthly limit</label>
            <input id="budget-amount" type="text" inputMode="decimal" required maxLength={13} placeholder="1000000" value={amount} disabled={pending}
              onChange={(event) => setAmount(event.target.value)} className={controlClass} aria-describedby="budget-rules" /></div>
        </div>
        <p id="budget-rules" className="text-sm text-slate-500">Use a dot for decimals, without thousands separators. Saving the same month, category, and currency updates its existing limit. Budgets do not carry over automatically.</p>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending} className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700">{pending ? "Saving…" : "Save budget"}</Button>
          <Button type="button" variant="outline" disabled={pending} onClick={() => { resetForm(); setError(""); setMessage(""); }}>Cancel</Button>
        </div>
      </form>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {message && <p role="status" className="text-sm text-emerald-600">{message}</p>}
      {!usageReady && <p role="status" className="text-sm text-slate-500">{expenseError ? "Expense data could not be loaded. Refresh the page to retry. Usage is unavailable." : "Loading expenses. Usage is not available yet."}</p>}
      {budgets.length === 0 && <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No budgets for this month. Set your first category limit above.</p>}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {budgets.map((budget) => {
          let usage: BudgetUsage | null = null;
          if (usageReady) { try { usage = calculateBudgetUsage(budget, expenseItems); } catch { /* Do not show a false zero for invalid expense data. */ } }
          const label = EXPENSE_CATEGORY_OPTIONS.find((item) => item.value === budget.category)?.label ?? budget.category;
          const color = usage?.status === "Over budget" || usage?.status === "At limit" ? "bg-red-500" : usage?.status === "Near limit" ? "bg-amber-500" : "bg-emerald-500";
          return <article key={budget.id} className="space-y-3 rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-wrap justify-between gap-2"><h3 className="font-bold text-slate-900">{label} · {budget.currency}</h3><span className="text-sm text-slate-500">{usage?.status ?? "Usage unavailable"}</span></div>
            <p className="text-sm text-slate-900">Limit: {formatCurrency(Number(budget.amount), budget.currency)}</p>
            <p className="text-sm text-slate-500">Spent: {usage ? formatCurrency(Number(usage.spent) / 100, budget.currency) : "—"} · Remaining: {usage ? formatCurrency(Number(usage.remaining) / 100, budget.currency) : "—"}</p>
            {usage && <><div role="progressbar" aria-label={`${label} budget used`} aria-valuenow={Math.max(0, Math.min(100, usage.percent))} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${usage.percent}% used`} className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, usage.percent))}%` }} /></div><p className="text-xs text-slate-500">{usage.percent}% used</p></>}
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" disabled={pending} onClick={() => { setEditing(budget.id); setCategory(budget.category); setCurrency(budget.currency); setAmount(budget.amount); setError(""); setMessage(""); }}>Edit</Button>
              <Button type="button" variant="outline" disabled={pending} onClick={() => void remove(budget)} className="text-red-600">Delete</Button>
            </div>
          </article>;
        })}
      </div>
    </div>
  );
}

export default function BudgetSection() {
  const [month, setMonth] = useState(() => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; });
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  return <section><Card className="rounded-[32px] border-slate-200 bg-white shadow-none"><CardContent className="space-y-5 p-6">
    <div><p className="text-sm text-slate-500">Monthly planning</p><h2 className="mt-2 text-2xl font-bold text-slate-900">Category budgets</h2><p className="mt-2 text-sm text-slate-500">Usage follows recorded Expense dates, categories, and original currencies. Expenses in other currencies are counted separately.</p></div>
    <div className="max-w-xs"><label htmlFor="budget-month" className="text-sm font-semibold text-slate-900">Budget month</label><input id="budget-month" type="month" required min="1000-01" max="9999-12" value={month} disabled={busy} onChange={(event) => setMonth(event.target.value)} className={controlClass} /></div>
    {isBudgetMonth(month) ? <BudgetMonth key={`${month}-${retry}`} month={month} onBusy={setBusy} onRetry={() => setRetry((value) => value + 1)} /> : <p className="text-sm text-slate-500">Choose a valid month.</p>}
  </CardContent></Card></section>;
}
