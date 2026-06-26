"use client";

import { useMemo, useState } from "react";
import { ALL_FILTER_VALUE } from "@/constants/history-filters";

type HistoryFilterMatcher<TItem, TFilterValues> = (
  item: TItem,
  filters: TFilterValues,
) => boolean;

export default function useHistoryFilters<
  TItem,
  TFilterValues extends Record<string, string>,
>(
  items: TItem[],
  initialFilters: TFilterValues,
  matcher: HistoryFilterMatcher<TItem, TFilterValues>,
) {
  const [filters, setFilters] = useState<TFilterValues>(initialFilters);

  const filteredItems = useMemo(() => {
    return items.filter((item) => matcher(item, filters));
  }, [items, filters, matcher]);

  const hasActiveFilter = Object.values(filters).some(
    (value) => value !== ALL_FILTER_VALUE,
  );

  function setFilter(filterKey: keyof TFilterValues, value: string) {
    setFilters(
      (currentFilters) =>
        ({
          ...currentFilters,
          [filterKey]: value,
        }) as TFilterValues,
    );
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  return {
    filters,
    setFilter,
    resetFilters,
    filteredItems,
    hasActiveFilter,
  };
}
