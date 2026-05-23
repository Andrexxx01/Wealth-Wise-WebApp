import type { FormSelectProps } from "@/types/form";
import { cn } from "@/lib/utils";

export default function FormSelect({
  label,
  options,
  error,
  placeholder,
  registration,
  disabled = false,
  className,
  selectClassName,
}: FormSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-semibold text-slate-900">{label}</label>

      <select
        disabled={disabled}
        className={cn(
          "h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
          error && "border-red-300 focus:border-red-500",
          selectClassName,
        )}
        {...registration}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
