"use client";

import DeleteRecordButton from "@/components/dashboard/delete-record-button";
import EditRecordButton from "@/components/dashboard/edit-record-button";
import type { RecordActionButtonsProps } from "@/types/record-action-buttons";

export default function RecordActionButtons({
  onEdit,
  onDelete,
  deleteConfirmMessage,
  className,
}: RecordActionButtonsProps) {
  return (
    <div className={`flex justify-end gap-3 ${className ?? ""}`}>
      <EditRecordButton onClick={onEdit} />

      <DeleteRecordButton
        confirmMessage={deleteConfirmMessage}
        onConfirmDelete={onDelete}
      />
    </div>
  );
}
