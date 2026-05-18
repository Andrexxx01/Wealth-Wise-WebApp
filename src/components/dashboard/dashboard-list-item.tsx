import type { DashboardListItemProps } from "@/types/ui";
import { cn } from "@/lib/utils";

const valueToneClass = {
  default: "text-slate-900",
  positive: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-red-600",
};

export default function DashboardListItem({
  title,
  subtitle,
  value,
  meta,
  tone = "default",
  className,
  children,
}: DashboardListItemProps) {
  return (
    <div
      className={cn("rounded-[28px] border border-slate-200 p-5", className)}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-semibold text-slate-900">{title}</p>

          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>

        {(value || meta) && (
          <div className="text-left sm:text-right">
            {value ? (
              <p
                className={cn("text-base font-semibold", valueToneClass[tone])}
              >
                {value}
              </p>
            ) : null}

            {meta ? (
              <p className="mt-1 text-sm text-slate-500">{meta}</p>
            ) : null}
          </div>
        )}
      </div>

      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
