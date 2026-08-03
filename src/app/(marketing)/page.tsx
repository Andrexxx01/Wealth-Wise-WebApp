import { auth } from "@/auth";
import LandingPageClient from "@/components/marketing/landing-page-client";

export default async function LandingPage() {
  const session = await auth();

  return <LandingPageClient isAuthenticated={Boolean(session?.user?.id)} />;
}
