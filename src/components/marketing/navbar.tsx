"use client";

import Link from "next/link";
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";

type MarketingNavbarProps = {
  isAuthenticated?: boolean;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
};

export default function MarketingNavbar({
  isAuthenticated = false,
  onOpenLogin,
  onOpenRegister,
}: MarketingNavbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo href="/" />

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600"
          >
            Home
          </Link>

          <Link
            href="/#features"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600"
          >
            Features
          </Link>

          <Link
            href="/pricing"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              asChild
              className="h-12 rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              {onOpenLogin ? (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="cursor-pointer text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-600"
                >
                  Log In
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-600"
                >
                  Log In
                </Link>
              )}

              {onOpenRegister ? (
                <Button
                  type="button"
                  onClick={onOpenRegister}
                  className="h-12 rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Get Started Free
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-12 rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  <Link href="/register">Get Started Free</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
