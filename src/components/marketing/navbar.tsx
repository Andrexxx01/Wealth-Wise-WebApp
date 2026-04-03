"use client";

import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";

type MarketingNavbarProps = {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
};

export default function MarketingNavbar({
  onOpenLogin,
  onOpenRegister,
}: MarketingNavbarProps) {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenLogin}
            className="cursor-pointer text-sm font-semibold text-slate-900 transition hover:text-emerald-600"
          >
            Log In
          </button>

          <Button
            type="button"
            onClick={onOpenRegister}
            className="h-12 rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </header>
  );
}
