"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ProfileDropdownProps } from "@/types/profile-dropdown";

function getInitials(fullName: string) {
  const words = fullName.trim().split(" ").filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getAccountDescription(
  userPlan: ProfileDropdownProps["userPlan"],
  subscriptionStatus: ProfileDropdownProps["subscriptionStatus"],
) {
  if (userPlan === "PRO" && subscriptionStatus === "ACTIVE") {
    return "Pro subscription active";
  }

  if (userPlan === "PRO") {
    return "Pro account";
  }

  return "Free account";
}

export default function ProfileDropdown({
  userName,
  userEmail,
  userImage,
  userPlan,
  subscriptionStatus,
}: ProfileDropdownProps) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const displayName = userName.trim() || "User";
  const initials = getInitials(displayName) || "U";

  const accountDescription = getAccountDescription(
    userPlan,
    subscriptionStatus,
  );

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  function handleToggleDropdown() {
    setIsOpen((currentValue) => !currentValue);
  }

  function handleCloseDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        onClick={handleToggleDropdown}
        className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-emerald-600 text-sm font-black text-white outline-none transition hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-100"
      >
        {userImage ? (
          // Menggunakan img agar avatar OAuth dari berbagai domain
          // tidak membutuhkan konfigurasi remotePatterns Next Image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={userImage}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Close profile menu"
            onClick={handleCloseDropdown}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div
            role="menu"
            className="absolute right-0 z-50 mt-3 w-72 rounded-[24px] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60"
          >
            <div className="rounded-[20px] bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-600 text-sm font-black text-white">
                  {userImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={userImage}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {displayName}
                  </p>

                  <p className="truncate text-xs font-medium text-slate-500">
                    {userEmail}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {userPlan} Plan
                  </p>

                  <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                    {accountDescription}
                  </p>
                </div>

                <span
                  className={
                    userPlan === "PRO"
                      ? "rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700"
                      : "rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600"
                  }
                >
                  {userPlan}
                </span>
              </div>
            </div>

            <div className="mt-2 grid gap-1">
              <Link
                href="/profile"
                role="menuitem"
                onClick={handleCloseDropdown}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Profile
              </Link>

              <Link
                href="/settings"
                role="menuitem"
                onClick={handleCloseDropdown}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Settings
              </Link>

              {userPlan === "FREE" ? (
                <Link
                  href="/pricing"
                  role="menuitem"
                  onClick={handleCloseDropdown}
                  className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Upgrade to Pro
                </Link>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
