"use client";

type HistoryFilterOption = {
  value: string;
  label: string;
};

type HistoryFilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly HistoryFilterOption[];
};

export default function HistoryFilterSelect({
  label,
  value,
  onChange,
  options,
}: HistoryFilterSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-900">{label}</label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
