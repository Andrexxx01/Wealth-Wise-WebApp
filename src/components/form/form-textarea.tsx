import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { FormTextareaProps } from "@/types/form";

export default function FormTextarea({
  label,
  error,
  registration,
  className,
  textareaClassName,
  ...props
}: FormTextareaProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-semibold text-slate-900">{label}</label>

      <Textarea
        className={cn(
          "min-h-24 rounded-2xl border-slate-200 shadow-none",
          error && "border-red-300 focus-visible:ring-red-500",
          textareaClassName,
        )}
        {...props}
        {...registration}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
