"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { mockUserProfile } from "@/lib/mock-data/user";

function getFirstName(fullName: string) {
  return fullName.split(" ")[0] ?? fullName;
}

function getInitials(fullName: string) {
  const words = fullName.trim().split(" ").filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function ProfileDropdown() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fullName = mockUserProfile.fullName;
  const firstName = getFirstName(fullName);
  const initials = getInitials(fullName);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleLogout() {
    setIsOpen(false);
    router.push("/");
  }

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        type="button"
        variant="outline"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="h-12 rounded-2xl border-slate-300 bg-white px-4 font-semibold text-slate-900 hover:bg-slate-100"
      >
        <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-xs font-black text-emerald-700">
          {initials}
        </span>

        {firstName}
      </Button>

      {isOpen ? (
        <div className="absolute right-0 mt-3 w-72 rounded-[28px] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70">
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-black text-white">
                {initials}
              </div>

              <div>
                <p className="font-bold text-slate-900">{fullName}</p>
                <p className="text-sm text-slate-500">Demo account</p>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="block rounded-2xl px-4 py-3 transition hover:bg-slate-50"
            >
              <p className="text-sm font-bold text-slate-900">Profile</p>
              <p className="mt-1 text-xs text-slate-500">
                View your personal profile
              </p>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="block rounded-2xl px-4 py-3 transition hover:bg-slate-50"
            >
              <p className="text-sm font-bold text-slate-900">Settings</p>
              <p className="mt-1 text-xs text-slate-500">
                Manage app preferences
              </p>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl px-4 py-3 text-left transition hover:bg-red-50"
            >
              <p className="text-sm font-bold text-red-600">Logout</p>
              <p className="mt-1 text-xs text-red-400">
                Return to landing page
              </p>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
