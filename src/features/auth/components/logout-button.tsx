"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import { logoutAction } from "@/features/auth/actions/logout-action";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
};

function LogoutSubmitButton({ className }: LogoutButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" />

      <span>{pending ? "Logging out..." : "Log out"}</span>
    </button>
  );
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <form action={logoutAction} className="w-full">
      <LogoutSubmitButton className={className} />
    </form>
  );
}
