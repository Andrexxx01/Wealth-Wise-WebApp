"use client";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[28px] border border-slate-200 p-0 shadow-2xl sm:max-w-lg">
        <div className="px-8 py-8">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          <div className="mb-8 text-center">
            <DialogTitle className="text-4xl font-bold tracking-tight text-slate-900">
              Create Your Account
            </DialogTitle>
            <DialogDescription className="mt-3 text-base text-slate-500">
              Start your journey to financial freedom today
            </DialogDescription>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                className="h-14 rounded-2xl border-slate-200 text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                className="h-14 rounded-2xl border-slate-200 text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-14 rounded-2xl border-slate-200 text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-14 rounded-2xl border-slate-200 text-base"
              />
            </div>

            <Button
              type="submit"
              className="h-14 w-full rounded-2xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-base text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign In
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
