import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardNavbar from "@/components/layout/dashboard-navbar";
import FinanceProvider from "@/features/finance/components/finance-provider";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <DashboardNavbar />

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </FinanceProvider>
  );
}
