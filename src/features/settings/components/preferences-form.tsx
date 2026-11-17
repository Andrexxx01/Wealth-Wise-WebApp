"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/components/current-user-provider";
import type { UserPreferences } from "@/types/user-preferences";

export default function PreferencesForm() {
  const { currentUser } = useCurrentUser();
  const [currency, setCurrency] = useState<UserPreferences["currency"]>(currentUser.currency);
  const [theme, setTheme] = useState<UserPreferences["theme"]>(currentUser.theme);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const changed = currency !== currentUser.currency || theme !== currentUser.theme;

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!changed || inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/account/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency, theme }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? "Could not save preferences.");
      // Reload every provider from the saved account, including valuations.
      // This prevents mixing old-currency responses with the new selection.
      window.location.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save preferences.");
      inFlight.current = false;
      setSaving(false);
    }
  }

  const inputClass = "mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-60";

  return (
    <form onSubmit={save} className="mb-6 space-y-5" aria-busy={saving}>
      <div>
        <label htmlFor="display-currency" className="text-sm font-semibold text-slate-900">Display currency</label>
        <select id="display-currency" value={currency} disabled={saving}
          onChange={(event) => setCurrency(event.target.value as UserPreferences["currency"])} className={inputClass}>
          <option value="USD">USD — US Dollar</option>
          <option value="IDR">IDR — Indonesian Rupiah</option>
        </select>
        <p className="mt-2 text-sm text-slate-500">Used for summaries and portfolio values. Original transaction currencies stay unchanged.</p>
      </div>
      <div>
        <label htmlFor="display-theme" className="text-sm font-semibold text-slate-900">Theme</label>
        <select id="display-theme" value={theme} disabled={saving}
          onChange={(event) => setTheme(event.target.value as UserPreferences["theme"])} className={inputClass}>
          <option value="LIGHT">Light</option>
          <option value="DARK">Dark</option>
          <option value="SYSTEM">System</option>
        </select>
        <p className="mt-2 text-sm text-slate-500">System follows your device appearance. Preferences are saved to your account.</p>
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={!changed || saving}
        className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
        {saving ? "Saving…" : "Save preferences"}
      </Button>
      <p role="status" className="text-sm text-slate-500">{saving ? "Applying preferences. The page will reload." : changed ? "You have unsaved changes." : "Your saved preferences are applied."}</p>
    </form>
  );
}
