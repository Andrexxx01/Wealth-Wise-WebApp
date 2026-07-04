"use client";

import type { ReactNode } from "react";
import HistoryClearAllButton from "@/components/dashboard/history-clear-all-button";
import HistoryFilterPanel from "@/components/dashboard/history-filter-panel";
import HistorySearchInput from "@/components/dashboard/history-search-input";

type HistoryControlsProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  resultCount: number;
  totalCount: number;
  recordLabel: string;
  hasActiveFilter: boolean;
  isFiltering: boolean;
  onResetFilters: () => void;
  onClearAll: () => void;
  sortControl?: ReactNode;
  children: ReactNode;
};

export default function HistoryControls({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  resultCount,
  totalCount,
  recordLabel,
  hasActiveFilter,
  isFiltering,
  onResetFilters,
  onClearAll,
  sortControl,
  children,
}: HistoryControlsProps) {
  return (
    <div className="space-y-4">
      <HistorySearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
        resultCount={resultCount}
        totalCount={totalCount}
        recordLabel={recordLabel}
      />

      <HistoryFilterPanel
        hasActiveFilter={hasActiveFilter}
        onResetFilters={onResetFilters}
      >
        {children}
      </HistoryFilterPanel>

      {sortControl ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-4">
          {sortControl}
        </div>
      ) : null}

      <HistoryClearAllButton isVisible={isFiltering} onClearAll={onClearAll} />
    </div>
  );
}
