"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/common/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Income", href: "/income" },
  { label: "Expenses", href: "/expenses" },
  { label: "Investments", href: "/investments" },
  { label: "Loans", href: "/loans" },
  { label: "Analysis", href: "/analysis" },
];

export default function DashboardNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Logo textClassName="text-xl" iconClassName="h-9 w-9" />

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-2xl px-4 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 outline-none transition hover:bg-slate-50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-emerald-100 text-sm font-semibold text-emerald-700">
                AK
              </AvatarFallback>
            </Avatar>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-900">
                Andre Kurniawan
              </p>
              <p className="text-xs text-slate-500">Personal Account</p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-2xl">
            <DropdownMenuItem className="cursor-pointer rounded-xl">
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl">
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl">
              Appearance
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-xl text-red-600 focus:text-red-600">
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
