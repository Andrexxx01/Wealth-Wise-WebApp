import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  showText?: boolean;
  iconClassName?: string;
  wrapperClassName?: string;
  textClassName?: string;
};

export default function Logo({
  href = "/",
  showText = true,
  iconClassName,
  wrapperClassName,
  textClassName,
}: LogoProps) {
  const gradientId = useId();

  return (
    <Link
      href={href}
      aria-label="WealthWise Home"
      className={cn("inline-flex items-center", wrapperClassName)}
    >
      <svg
        className={cn("h-10 w-10 shrink-0", iconClassName)}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="100" height="100" rx="20" fill={`url(#${gradientId})`} />
        <path
          d="M50 25V75M42 35C42 31 45 28 50 28C55 28 58 31 58 35C58 38 56 40 50 42L42 45C36 47 34 49 34 55C34 60 37 65 42 67"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M58 67C58 71 55 74 50 74C45 74 42 71 42 67"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="70" cy="30" r="3" fill="white" opacity="0.8" />
        <circle cx="75" cy="25" r="2" fill="white" opacity="0.6" />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <span
          className={cn(
            "ml-3 text-2xl font-bold tracking-tight bg-linear-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent",
            textClassName,
          )}
        >
          WealthWise
        </span>
      )}
    </Link>
  );
}
