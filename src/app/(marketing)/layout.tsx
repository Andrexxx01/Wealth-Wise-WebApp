import type { ReactNode } from "react";
import MarketingNavbar from "@/components/marketing/navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNavbar />
      {children}
    </div>
  );
}
