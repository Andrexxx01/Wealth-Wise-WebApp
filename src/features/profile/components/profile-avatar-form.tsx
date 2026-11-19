"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/components/current-user-provider";
import { AVATAR_MIME_TYPES, MAX_AVATAR_UPLOAD_BYTES } from "@/features/profile/lib/avatar-options";

export default function ProfileAvatarForm() {
  const { currentUser } = useCurrentUser();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState<"upload" | "remove" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    setFile(null);
    setPreview(null);
    setError(null);
    if (!next) return;
    if (!AVATAR_MIME_TYPES.includes(next.type) || next.size === 0 || next.size > MAX_AVATAR_UPLOAD_BYTES) {
      setError("Choose a JPG, PNG, or WebP image up to 2 MB.");
      event.target.value = "";
      return;
    }
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }

  function cancel() {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function submit(action: "upload" | "remove") {
    if (inFlight.current || (action === "upload" && !file)) return;
    inFlight.current = true;
    setPending(action);
    setError(null);
    try {
      const body = new FormData();
      if (file) body.set("avatar", file);
      const response = await fetch("/api/account/avatar", {
        method: action === "upload" ? "POST" : "DELETE",
        body: action === "upload" ? body : undefined,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Could not update your photo.");
      window.location.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update your photo.");
      inFlight.current = false;
      setPending(null);
    }
  }

  function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit("upload");
  }

  return (
    <form onSubmit={upload} className="mt-6 space-y-4 border-t border-slate-200 pt-6" aria-busy={pending !== null}>
      <h3 className="text-lg font-bold text-slate-900">Profile photo</h3>
      <label htmlFor="profile-photo" className="block text-sm font-semibold text-slate-900">Choose a photo</label>
      <input ref={inputRef} id="profile-photo" type="file" accept={AVATAR_MIME_TYPES.join(",")}
        disabled={pending !== null} onChange={selectFile} aria-describedby="profile-photo-help profile-photo-error"
        className="block w-full min-w-0 rounded-2xl border border-slate-300 bg-white p-3 text-sm text-slate-900 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-white" />
      <p id="profile-photo-help" className="text-sm text-slate-500">JPG, PNG, or WebP up to 2 MB and 20 megapixels. Saved as a square 256 × 256 avatar.</p>
      {preview && (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Selected profile photo preview" className="h-24 w-24 rounded-2xl object-cover" />
          <p className="text-sm text-slate-500">Preview — click Save photo to apply.</p>
        </div>
      )}
      <p id="profile-photo-error" role="alert" className="text-sm text-red-600">{error}</p>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={!file || pending !== null}
          className="h-11 rounded-2xl bg-emerald-600 px-5 text-white hover:bg-emerald-700">{pending === "upload" ? "Saving…" : "Save photo"}</Button>
        <Button type="button" variant="outline" onClick={cancel} disabled={!file || pending !== null}
          className="h-11 rounded-2xl border-slate-300 bg-white px-5 text-slate-900 hover:bg-slate-100">Cancel</Button>
        <Button type="button" variant="outline" onClick={() => void submit("remove")} disabled={!currentUser.image || pending !== null}
          className="h-11 rounded-2xl border-red-200 bg-white px-5 text-red-600 hover:bg-red-50">{pending === "remove" ? "Removing…" : "Remove photo"}</Button>
      </div>
      <p role="status" className="text-sm text-slate-500">{pending ? "Updating your profile photo. The page will reload." : "Your saved photo is shared across your profile and navigation."}</p>
    </form>
  );
}
