"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ProfileDropdown from "@/components/layout/profile-dropdown";
import { Button } from "@/components/ui/button";
import PlanBadge from "@/features/subscription/components/plan-badge";
import type { SubscriptionStatus, UserPlan } from "@/types/user-subscription";
import Logo from "@/components/common/logo";

type DashboardNavbarProps = {
  userName: string;
  userEmail: string;
  userImage: string | null;
  userPlan: UserPlan;
  subscriptionStatus: SubscriptionStatus;
};

const dashboardLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Income", href: "/income" },
  { label: "Expenses", href: "/expenses" },
  { label: "Investments", href: "/investments" },
  { label: "Loans", href: "/loans" },
  { label: "Analysis", href: "/analysis" },
];

const accountLinks = [
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getDesktopLinkClassName(isActive: boolean) {
  return `rounded-2xl px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-emerald-600 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

function getMobileLinkClassName(isActive: boolean) {
  return `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
    isActive
      ? "bg-emerald-600 text-white"
      : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

function getMobileAccountLinkClassName(isActive: boolean) {
  return `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
    isActive
      ? "bg-emerald-50 text-emerald-700"
      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
  }`;
}

function getInitials(fullName: string) {
  const words = fullName.trim().split(" ").filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getAccountDescription(
  userPlan: UserPlan,
  subscriptionStatus: SubscriptionStatus,
) {
  if (userPlan === "PRO" && subscriptionStatus === "ACTIVE") {
    return "Pro subscription active";
  }

  if (userPlan === "PRO") {
    return "Pro account";
  }

  return "Free account";
}

export default function DashboardNavbar({
  userName,
  userEmail,
  userImage,
  userPlan,
  subscriptionStatus,
}: DashboardNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fullName = userName.trim() || "User";
  const initials = getInitials(fullName) || "U";

  const accountDescription = getAccountDescription(
    userPlan,
    subscriptionStatus,
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  function handleToggleMobileMenu() {
    setIsMobileMenuOpen((currentValue) => !currentValue);
  }

  function handleLogout() {
    setIsMobileMenuOpen(false);

    // Sementara hanya berpindah halaman.
    // Logout Auth.js akan kita perbaiki pada tahap terakhir.
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Logo
              href="/dashboard"
              showText={false}
              iconClassName="h-11 w-11"
              wrapperClassName="shrink-0"
            />

            <div>
              <p className="text-base font-black tracking-tight text-slate-900">
                WealthWise
              </p>

              <p className="text-xs font-medium text-slate-500">
                Personal Finance Tracker
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 xl:hidden">
            <PlanBadge plan={userPlan} />

            <Button
              type="button"
              variant="outline"
              aria-expanded={isMobileMenuOpen}
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              onClick={handleToggleMobileMenu}
              className="h-10 rounded-xl border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? "Close" : "Menu"}
            </Button>
          </div>
        </div>

        <nav className="hidden gap-2 xl:flex">
          {dashboardLinks.map((link) => {
            const isActive = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={getDesktopLinkClassName(isActive)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {isMobileMenuOpen ? (
          <div className="grid gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-3 xl:hidden">
            <nav className="grid gap-2">
              {dashboardLinks.map((link) => {
                const isActive = isActivePath(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={getMobileLinkClassName(isActive)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="rounded-[24px] bg-white p-3">
              <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-black text-white">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {fullName}
                    </p>

                    <p className="truncate text-xs font-medium text-slate-500">
                      {accountDescription}
                    </p>
                  </div>
                </div>

                <PlanBadge plan={userPlan} />
              </div>

              <div className="grid gap-2">
                {accountLinks.map((link) => {
                  const isActive = isActivePath(pathname, link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={getMobileAccountLinkClassName(isActive)}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="hidden items-center gap-3 xl:flex">
          <PlanBadge plan={userPlan} />

          <div className="text-right">
            <p className="max-w-40 truncate text-sm font-bold text-slate-900">
              {fullName}
            </p>

            <p className="mt-0.5 text-xs font-medium text-slate-500">
              {accountDescription}
            </p>
          </div>

          <ProfileDropdown
            userName={userName}
            userEmail={userEmail}
            userImage={userImage}
            userPlan={userPlan}
            subscriptionStatus={subscriptionStatus}
          />
        </div>
      </div>
    </header>
  );
}
