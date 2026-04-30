import { Card, CardContent } from "@/components/ui/card";
import type { SummaryCardProps } from "@/types/ui";
import { cn } from "@/lib/utils";

const valueToneClass = {
  default: "text-slate-900",
  positive: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-red-600",
};

export default function SummaryCard({
  label,
  value,
  helper,
  tone = "default",
}: SummaryCardProps) {
  return (
    <Card className="rounded-[28px] border-slate-200 bg-white shadow-none">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-slate-500">{label}</p>

        <h2
          className={cn(
            "mt-3 text-3xl font-bold tracking-tight",
            valueToneClass[tone],
          )}
        >
          {value}
        </h2>

        {helper ? (
          <p className="mt-3 text-sm text-slate-500">{helper}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
