"use client";

import { useCallback } from "react";

type UseHistoryClearAllOptions = {
  resetSearch: () => void;
  resetFilters: () => void;
  resetSort: () => void;
};

export default function useHistoryClearAll({
  resetSearch,
  resetFilters,
  resetSort,
}: UseHistoryClearAllOptions) {
  const handleClearAll = useCallback(() => {
    resetSearch();
    resetFilters();
    resetSort();
  }, [resetSearch, resetFilters, resetSort]);

  return handleClearAll;
}
