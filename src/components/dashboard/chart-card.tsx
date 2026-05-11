import { Card, CardContent } from "@/components/ui/card";
import type { ChartCardProps } from "@/types/ui";

export default function ChartCard({
  eyebrow,
  title,
  badge,
  children,
}: ChartCardProps) {
  return (
    <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            {eyebrow ? (
              <p className="text-sm font-medium text-slate-500">{eyebrow}</p>
            ) : null}

            <h3 className="mt-2 text-2xl font-bold text-slate-900">{title}</h3>
          </div>

          {badge ? (
            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              {badge}
            </div>
          ) : null}
        </div>

        {children}
      </CardContent>
    </Card>
  );
}
