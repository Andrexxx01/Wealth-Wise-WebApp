import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardNavbar from "@/components/layout/dashboard-navbar";
import CurrentUserProvider from "@/features/auth/components/current-user-provider";
import FinanceProvider from "@/features/finance/components/finance-provider";
import type { CurrentUser } from "@/types/current-user";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser: CurrentUser = {
    id: session.user.id,
    name: session.user.name ?? session.user.email ?? "User",
    email: session.user.email ?? "",
    image: session.user.image ?? null,
    plan: session.user.plan,
    subscriptionStatus: session.user.subscriptionStatus,
  };

  return (
    <CurrentUserProvider currentUser={currentUser}>
      <FinanceProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <DashboardNavbar
            userName={currentUser.name}
            userEmail={currentUser.email}
            userImage={currentUser.image}
            userPlan={currentUser.plan}
            subscriptionStatus={currentUser.subscriptionStatus}
          />

          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </FinanceProvider>
    </CurrentUserProvider>
  );
}
