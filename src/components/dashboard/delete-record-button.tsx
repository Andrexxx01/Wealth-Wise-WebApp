"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { DeleteRecordButtonProps } from "@/types/delete-record-button";

export default function DeleteRecordButton({
  confirmMessage,
  onConfirmDelete,
  label = "Delete",
  className,
}: DeleteRecordButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (isDeleting) return;

    const isConfirmed = window.confirm(confirmMessage);

    if (!isConfirmed) return;

    try {
      setIsDeleting(true);

      await onConfirmDelete();
    } catch (error) {
      console.error("Failed to delete record:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isDeleting}
      onClick={handleDelete}
      className={`h-10 rounded-xl border-red-200 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 ${
        className ?? ""
      }`}
    >
      {isDeleting ? "Deleting..." : label}
    </Button>
  );
}
