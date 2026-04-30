import type { SectionHeaderProps } from "@/types/ui";
import { cn } from "@/lib/utils";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="space-y-3">
        {eyebrow ? (
          <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {eyebrow}
          </span>
        ) : null}

        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        {description ? (
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </section>
  );
}
