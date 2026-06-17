"use client";

import { Button } from "@/components/ui/button";
import type { EditRecordButtonProps } from "@/types/edit-record-button";

export default function EditRecordButton({
  onClick,
  label = "Edit",
  className,
}: EditRecordButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={`h-10 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-100 ${
        className ?? ""
      }`}
    >
      {label}
    </Button>
  );
}
