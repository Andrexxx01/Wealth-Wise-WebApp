"use client";

type HistorySearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export default function HistorySearchInput({
  value,
  onChange,
  placeholder,
}: HistorySearchInputProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-none">
      <label
        htmlFor="history-search"
        className="mb-2 block text-sm font-bold text-slate-900"
      >
        Search Records
      </label>

      <input
        id="history-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}
