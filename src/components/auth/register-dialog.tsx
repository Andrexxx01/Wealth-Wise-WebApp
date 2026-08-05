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

type RegisterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
};

export default function RegisterDialog({
  open,
  onOpenChange,
  onSwitchToLogin,
}: RegisterDialogProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      setErrorMessage("Full name is required.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password confirmation does not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const registerResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          password,
        }),
      });

      const registerBody = await registerResponse.json().catch(() => null);

      if (!registerResponse.ok) {
        throw new Error(
          registerBody?.message ?? "Failed to create your account.",
        );
      }

      const loginResult = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
      });

      if (!loginResult || loginResult.error) {
        throw new Error(
          "Account created successfully, but automatic login failed. Please sign in manually.",
        );
      }

      onOpenChange(false);

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Register dialog error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong during registration.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSwitchToLogin() {
    setErrorMessage("");
    onSwitchToLogin();
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
              Create Your Account
            </DialogTitle>

            <DialogDescription className="mt-3 text-base text-slate-500">
              Create an account to store and manage your financial records.
            </DialogDescription>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="register-name"
                className="text-sm font-semibold text-slate-900"
              >
                Full Name
              </label>

              <Input
                id="register-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                disabled={isSubmitting}
                required
                className="h-14 rounded-2xl border-slate-200 text-base"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="register-email"
                className="text-sm font-semibold text-slate-900"
              >
                Email
              </label>

              <Input
                id="register-email"
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
                htmlFor="register-password"
                className="text-sm font-semibold text-slate-900"
              >
                Password
              </label>

              <Input
                id="register-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                disabled={isSubmitting}
                required
                minLength={8}
                className="h-14 rounded-2xl border-slate-200 text-base"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="register-confirm-password"
                className="text-sm font-semibold text-slate-900"
              >
                Confirm Password
              </label>

              <Input
                id="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
                disabled={isSubmitting}
                required
                minLength={8}
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
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-base text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleSwitchToLogin}
              disabled={isSubmitting}
              className="cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Sign In
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
