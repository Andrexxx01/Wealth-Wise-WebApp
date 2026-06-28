"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type HistoryFilterPanelProps = {
  hasActiveFilter: boolean;
  onResetFilters: () => void;
  children: ReactNode;
};

export default function HistoryFilterPanel({
  hasActiveFilter,
  onResetFilters,
  children,
}: HistoryFilterPanelProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Filters</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Narrow records by category, type, frequency, or status.
          </p>
        </div>

        {hasActiveFilter ? (
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="h-10 rounded-xl border-slate-300 bg-white px-4 text-xs font-semibold text-slate-900 hover:bg-slate-100"
          >
            Reset Filters
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}
