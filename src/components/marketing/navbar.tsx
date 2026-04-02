import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/common/logo";

export default function MarketingNavbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium">
            Features
          </Link>
          <Link href="#benefits" className="text-sm font-medium">
            Benefits
          </Link>
          <Link href="#pricing" className="text-sm font-medium">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Log in</Link>
          </Button>

          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
