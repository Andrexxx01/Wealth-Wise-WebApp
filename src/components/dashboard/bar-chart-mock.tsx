import type { BarChartMockProps, GroupedBarChartMockProps } from "@/types/ui";

export function BarChartMock({ data }: BarChartMockProps) {
  return (
    <div className="rounded-[28px] bg-slate-50 p-6">
      <div className="flex h-72 items-end gap-4">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex flex-1 flex-col items-center gap-3"
          >
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-t-2xl bg-emerald-500"
                style={{ height: `${item.value}%` }}
              />
            </div>

            <span className="text-sm font-medium text-slate-500">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GroupedBarChartMock({
  data,
  primaryLabel = "Income",
  secondaryLabel = "Expense",
}: GroupedBarChartMockProps) {
  return (
    <div className="rounded-[28px] bg-slate-50 p-6">
      <div className="flex h-72 items-end gap-4">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex flex-1 flex-col items-center gap-3"
          >
            <div className="flex h-full w-full items-end justify-center gap-1">
              <div
                className="w-full rounded-t-2xl bg-emerald-500"
                style={{ height: `${item.primaryValue}%` }}
              />

              <div
                className="w-full rounded-t-2xl bg-slate-300"
                style={{ height: `${item.secondaryValue}%` }}
              />
            </div>

            <span className="text-sm font-medium text-slate-500">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-6 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          {primaryLabel}
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-slate-300" />
          {secondaryLabel}
        </div>
      </div>
    </div>
  );
}
