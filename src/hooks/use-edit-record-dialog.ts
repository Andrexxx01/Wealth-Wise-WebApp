"use client";

import { useState } from "react";

export default function useEditRecordDialog<TRecord>() {
  const [selectedRecord, setSelectedRecord] = useState<TRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  function openEditDialog(record: TRecord) {
    setSelectedRecord(record);
    setIsEditDialogOpen(true);
  }

  function handleEditDialogOpenChange(open: boolean) {
    setIsEditDialogOpen(open);

    if (!open) {
      setSelectedRecord(null);
    }
  }

  return {
    selectedRecord,
    isEditDialogOpen,
    openEditDialog,
    handleEditDialogOpenChange,
  };
}
