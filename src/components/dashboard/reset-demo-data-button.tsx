"use client";

import { Button } from "@/components/ui/button";

type ResetDemoDataButtonSize = "default" | "compact";

type ResetDemoDataButtonProps = {
  onReset: () => void;
  size?: ResetDemoDataButtonSize;
};

function getResetButtonClassName(size: ResetDemoDataButtonSize) {
  const baseClassName =
    "border-red-200 bg-white font-semibold text-red-600 hover:bg-red-50 hover:text-red-700";

  if (size === "compact") {
    return `${baseClassName} h-10 rounded-xl px-3 text-xs`;
  }

  return `${baseClassName} h-12 rounded-2xl px-6 text-sm`;
}

export default function ResetDemoDataButton({
  onReset,
  size = "default",
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
      className={getResetButtonClassName(size)}
    >
      {size === "compact" ? "Reset" : "Reset Demo Data"}
    </Button>
  );
}
