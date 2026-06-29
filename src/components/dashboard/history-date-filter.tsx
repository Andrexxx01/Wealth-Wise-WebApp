"use client";

type HistoryDateFilterProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function HistoryDateFilter({
  label,
  value,
  onChange,
}: HistoryDateFilterProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-900">{label}</label>

      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}
