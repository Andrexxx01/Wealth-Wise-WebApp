"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/components/current-user-provider";
import { profileSchema } from "@/features/profile/lib/profile-schema";

export default function ProfileDetailsForm() {
  const { currentUser } = useCurrentUser();
  const [name, setName] = useState(currentUser.name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const changed = name.trim() !== currentUser.name.trim();

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!changed || inFlight.current) return;
    const parsed = profileSchema.safeParse({ name });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid name.");
      return;
    }
    inFlight.current = true;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? "Could not save your name.");
      // The session callback reloads the name from the database on this request.
      window.location.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your name.");
      inFlight.current = false;
      setSaving(false);
    }
  }

  function cancel() {
    setName(currentUser.name);
    setError(null);
  }

  return (
    <form onSubmit={save} className="mt-6 space-y-4 border-t border-slate-200 pt-6" aria-busy={saving}>
      <h3 className="text-lg font-bold text-slate-900">Edit profile</h3>
      <div>
        <label htmlFor="profile-display-name" className="text-sm font-semibold text-slate-900">Display name</label>
        <input id="profile-display-name" name="name" autoComplete="name" type="text"
          value={name} onChange={(event) => setName(event.target.value)}
          maxLength={80} required disabled={saving}
          aria-invalid={error !== null} aria-describedby="profile-name-help profile-name-error"
          className="mt-2 h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-60" />
        <p id="profile-name-help" className="mt-2 text-sm text-slate-500">Shown on your profile, navigation, and Dashboard greeting. Maximum 80 characters.</p>
      </div>
      <p id="profile-name-error" role="alert" className="text-sm text-red-600">{error}</p>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={!changed || saving || name.trim().length === 0}
          className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700">
          {saving ? "Saving…" : "Save name"}
        </Button>
        <Button type="button" variant="outline" onClick={cancel} disabled={!changed || saving}
          className="h-11 rounded-2xl border-slate-300 bg-white px-5 text-slate-900 hover:bg-slate-100">Cancel</Button>
      </div>
      <p role="status" className="text-sm text-slate-500">{saving ? "Saving your name. The page will reload." : changed ? "You have unsaved changes." : "Your saved name is applied."}</p>
    </form>
  );
}
