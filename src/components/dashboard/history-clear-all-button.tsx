"use client";

import { Button } from "@/components/ui/button";

type HistoryClearAllButtonProps = {
  isVisible: boolean;
  onClearAll: () => void;
};

export default function HistoryClearAllButton({
  isVisible,
  onClearAll,
}: HistoryClearAllButtonProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onClearAll}
        className="h-10 rounded-xl border-red-200 bg-white px-4 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        Clear All
      </Button>
    </div>
  );
}
