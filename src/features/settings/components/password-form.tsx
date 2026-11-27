"use client";

import { useRef, useState, type FormEvent } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { changePasswordSchema } from "@/features/settings/lib/password-schema";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  function reset() {
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setMessage(""); setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setMessage(""); setError("");
    const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your password details.");
      return;
    }
    inFlight.current = true; setPending(true);
    try {
      const response = await fetch("/api/account/password", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message ?? "Unable to update your password.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setMessage("Password updated. Please sign in again.");
      await signOut({ redirect: false }).catch(() => undefined);
      window.location.assign("/login");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update your password.");
    } finally {
      inFlight.current = false; setPending(false);
    }
  }

  const inputClass = "mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 disabled:opacity-60";
  return (
    <form onSubmit={submit} className="space-y-5" aria-busy={pending}>
      <p id="password-help" className="text-sm leading-6 text-slate-500">
        Use at least 8 characters and at most 72 bytes. Changing your password signs out all sessions.
      </p>
      <div>
        <label htmlFor="current-password" className="text-sm font-semibold text-slate-900">Current password</label>
        <input id="current-password" type="password" autoComplete="current-password" required maxLength={1024}
          value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} disabled={pending} className={inputClass} />
      </div>
      <div>
        <label htmlFor="new-password" className="text-sm font-semibold text-slate-900">New password</label>
        <input id="new-password" type="password" autoComplete="new-password" required minLength={8} maxLength={72}
          aria-describedby="password-help" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} disabled={pending} className={inputClass} />
      </div>
      <div>
        <label htmlFor="confirm-password" className="text-sm font-semibold text-slate-900">Confirm new password</label>
        <input id="confirm-password" type="password" autoComplete="new-password" required maxLength={72}
          value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} disabled={pending} className={inputClass} />
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {message && <p role="status" className="text-sm text-emerald-600">{message}</p>}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending || !currentPassword || !newPassword || !confirmPassword}
          className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700">
          {pending ? "Saving…" : "Change password"}
        </Button>
        <Button type="button" variant="outline" disabled={pending} onClick={reset} className="h-12 rounded-2xl">Clear</Button>
      </div>
    </form>
  );
}
