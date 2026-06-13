"use client";

import { Button } from "@/components/ui/button";
import type { DeleteRecordButtonProps } from "@/types/delete-record-button";

export default function DeleteRecordButton({
  confirmMessage,
  onConfirmDelete,
  label = "Delete",
  className,
}: DeleteRecordButtonProps) {
  function handleDeleteClick() {
    const shouldDelete = window.confirm(confirmMessage);

    if (!shouldDelete) return;

    onConfirmDelete();
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleDeleteClick}
      className={`h-10 rounded-xl border-red-200 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 ${
        className ?? ""
      }`}
    >
      {label}
    </Button>
  );
}
