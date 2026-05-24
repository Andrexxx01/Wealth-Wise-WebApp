import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { FormInputProps } from "@/types/form";

export default function FormInput({
  label,
  error,
  registration,
  className,
  inputClassName,
  ...props
}: FormInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-semibold text-slate-900">{label}</label>

      <Input
        className={cn(
          "h-12 rounded-2xl border-slate-200 shadow-none",
          error && "border-red-300 focus-visible:ring-red-500",
          inputClassName,
        )}
        {...props}
        {...registration}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
