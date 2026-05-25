import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FormDialogShellProps } from "@/types/form";

export default function FormDialogShell({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  formProps,
}: FormDialogShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-[28px] border border-slate-200 p-0 shadow-2xl">
        <div className="px-8 py-8">
          <div className="mb-8">
            <DialogTitle className="text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </DialogTitle>

            <DialogDescription className="mt-3 text-base leading-7 text-slate-500">
              {description}
            </DialogDescription>
          </div>

          <form {...formProps} className="space-y-5">
            {children}

            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
              {footer}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
