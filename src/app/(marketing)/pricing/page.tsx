import { auth } from "@/auth";
import PricingPageClient from "@/features/subscription/components/pricing-page-client";

export default async function PricingPage() {
  const session = await auth();

  return (
    <PricingPageClient
      isAuthenticated={Boolean(session?.user?.id)}
      currentPlan={session?.user?.plan ?? null}
    />
  );
}
