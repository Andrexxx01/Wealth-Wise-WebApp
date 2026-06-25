"use client";

type HistorySearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  resultCount: number;
  totalCount: number;
  recordLabel?: string;
};

export default function HistorySearchInput({
  value,
  onChange,
  placeholder,
  resultCount,
  totalCount,
  recordLabel = "records",
}: HistorySearchInputProps) {
  const hasValue = value.trim().length > 0;

  function handleClearSearch() {
    onChange("");
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-none">
      <div className="mb-2 flex items-center justify-between gap-4">
        <label
          htmlFor="history-search"
          className="block text-sm font-bold text-slate-900"
        >
          Search Records
        </label>

        {hasValue ? (
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            Clear
          </button>
        ) : null}
      </div>

      <input
        id="history-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />

      <div className="mt-3 flex flex-col gap-1 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing{" "}
          <span className="font-semibold text-slate-700">{resultCount}</span> of{" "}
          <span className="font-semibold text-slate-700">{totalCount}</span>{" "}
          {recordLabel}
        </p>

        {hasValue ? (
          <p>
            Results for:{" "}
            <span className="font-semibold text-slate-700">{value}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
