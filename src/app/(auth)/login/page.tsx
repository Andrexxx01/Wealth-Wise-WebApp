"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid email or password.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong during login.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Welcome Back
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            Sign in to WealthWise
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Continue managing your income, expenses, investments, and loans.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="andre@example.com"
              className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              required
            />
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errorMessage}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-2xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          Do not have an account?{" "}
          <Link href="/register" className="font-bold text-emerald-600">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
