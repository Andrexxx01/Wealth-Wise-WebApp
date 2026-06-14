"use client";

import { Button } from "@/components/ui/button";

type ResetDemoDataButtonProps = {
  onReset: () => void;
};

export default function ResetDemoDataButton({
  onReset,
}: ResetDemoDataButtonProps) {
  function handleResetClick() {
    const shouldReset = window.confirm(
      "Are you sure you want to reset all demo data? Your local changes will be removed.",
    );

    if (!shouldReset) return;

    onReset();
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleResetClick}
      className="h-12 rounded-2xl border-red-200 bg-white px-6 font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      Reset Demo Data
    </Button>
  );
}
