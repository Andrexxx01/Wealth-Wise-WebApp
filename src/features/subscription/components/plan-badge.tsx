import type { UserPlan } from "@/types/user-subscription";

type PlanBadgeProps = {
  plan: UserPlan;
};

export default function PlanBadge({ plan }: PlanBadgeProps) {
  const isPro = plan === "PRO";

  return (
    <span
      className={
        isPro
          ? "inline-flex h-8 items-center rounded-full border border-amber-200 bg-amber-50 px-3 text-xs font-bold tracking-wide text-amber-700"
          : "inline-flex h-8 items-center rounded-full border border-slate-200 bg-slate-100 px-3 text-xs font-bold tracking-wide text-slate-600"
      }
    >
      {isPro ? "PRO" : "FREE"}
    </span>
  );
}
