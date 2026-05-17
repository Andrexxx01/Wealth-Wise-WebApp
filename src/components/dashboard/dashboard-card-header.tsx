import type { DashboardCardHeaderProps } from "@/types/ui";
import { cn } from "@/lib/utils";

export default function DashboardCardHeader({
  eyebrow,
  title,
  description,
  badge,
  className,
}: DashboardCardHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <p className="text-sm font-medium text-slate-500">{eyebrow}</p>
        ) : null}

        <h3 className="mt-2 text-2xl font-bold text-slate-900">{title}</h3>

        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      {badge ? (
        <div className="w-fit rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          {badge}
        </div>
      ) : null}
    </div>
  );
}
