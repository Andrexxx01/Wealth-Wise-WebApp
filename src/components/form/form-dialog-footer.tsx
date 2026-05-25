import { Button } from "@/components/ui/button";
import type { FormDialogFooterProps } from "@/types/form";

export default function FormDialogFooter({
  cancelLabel = "Cancel",
  submitLabel,
  isSubmitting = false,
  onCancel,
}: FormDialogFooterProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="h-12 rounded-2xl border-slate-300 px-6 font-semibold"
      >
        {cancelLabel}
      </Button>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
      >
        {submitLabel}
      </Button>
    </>
  );
}
