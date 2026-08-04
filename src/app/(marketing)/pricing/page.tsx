import type { Metadata } from "next";
import { auth } from "@/auth";
import PricingPageClient from "@/features/subscription/components/pricing-page-client";

export const metadata: Metadata = {
  title: "Pricing | WealthWise",
  description:
    "Compare WealthWise Free and Pro plans for personal finance tracking.",
};

export default async function PricingPage() {
  const session = await auth();

  return (
    <PricingPageClient
      isAuthenticated={Boolean(session?.user?.id)}
      currentPlan={session?.user?.plan ?? null}
    />
  );
}
