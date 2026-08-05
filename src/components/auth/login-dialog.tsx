"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type LoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
};

export default function LoginDialog({
  open,
  onOpenChange,
  onSwitchToRegister,
}: LoginDialogProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        throw new Error("Invalid email or password.");
      }

      onOpenChange(false);

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login dialog error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong during login.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSwitchToRegister() {
    setErrorMessage("");
    onSwitchToRegister();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[28px] border border-slate-200 p-0 shadow-2xl sm:max-w-lg">
        <div className="px-8 py-8">
          <div className="mb-8 flex justify-center">
            <Logo href="/" />
          </div>

          <div className="mb-8 text-center">
            <DialogTitle className="text-4xl font-bold tracking-tight text-slate-900">
              Welcome Back
            </DialogTitle>

            <DialogDescription className="mt-3 text-base text-slate-500">
              Sign in to continue to your financial dashboard.
            </DialogDescription>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="text-sm font-semibold text-slate-900"
              >
                Email
              </label>

              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                disabled={isSubmitting}
                required
                className="h-14 rounded-2xl border-slate-200 text-base"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="text-sm font-semibold text-slate-900"
              >
                Password
              </label>

              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                disabled={isSubmitting}
                required
                className="h-14 rounded-2xl border-slate-200 text-base"
              />
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
              >
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-2xl bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-base text-slate-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={handleSwitchToRegister}
              disabled={isSubmitting}
              className="cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Sign Up
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
