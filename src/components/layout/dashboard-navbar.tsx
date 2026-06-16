"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ResetDemoDataButton from "@/components/dashboard/reset-demo-data-button";
import { Button } from "@/components/ui/button";
import ProfileDropdown from "@/components/layout/profile-dropdown";
import { useFinance } from "@/features/finance/components/finance-provider";

const dashboardLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Income", href: "/income" },
  { label: "Expenses", href: "/expenses" },
  { label: "Investments", href: "/investments" },
  { label: "Loans", href: "/loans" },
  { label: "Analysis", href: "/analysis" },
];

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

export default function DashboardNavbar() {
  const pathname = usePathname();
  const { resetFinanceData } = useFinance();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-black text-white">
              W
            </div>

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
            <ResetDemoDataButton onReset={resetFinanceData} size="compact" />

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setIsMobileMenuOpen((currentValue) => !currentValue)
              }
              className="h-10 rounded-xl border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? "Close" : "Menu"}
            </Button>
          </div>
        </div>

        <nav className="hidden gap-2 xl:flex">
          {dashboardLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

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
          <nav className="grid gap-2 rounded-[28px] border border-slate-200 bg-slate-50 p-3 xl:hidden">
            {dashboardLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

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
        ) : null}

        <div className="hidden items-center gap-3 xl:flex">
          <ResetDemoDataButton onReset={resetFinanceData} />

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
