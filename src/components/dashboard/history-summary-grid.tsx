"use client";

type HistorySummaryItem = {
  label: string;
  value: string;
  description?: string;
};

type HistorySummaryGridProps = {
  items: HistorySummaryItem[];
};

export default function HistorySummaryGrid({ items }: HistorySummaryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {item.label}
          </p>

          <p className="mt-3 text-2xl font-black tracking-tight text-slate-900">
            {item.value}
          </p>

          {item.description ? (
            <p className="mt-2 text-sm font-medium text-slate-500">
              {item.description}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
