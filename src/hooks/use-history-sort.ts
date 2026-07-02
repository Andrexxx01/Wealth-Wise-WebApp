"use client";

import { useMemo, useState } from "react";
import {
  HISTORY_SORT_VALUES,
  type HistorySortValue,
} from "@/lib/history-sort-options";

type UseHistorySortOptions<TItem> = {
  items: TItem[];
  getDateValue: (item: TItem) => string | null | undefined;
  getAmountValue: (item: TItem) => number;
};

function getValidDateTime(
  dateValue: string | null | undefined,
  fallbackValue: number,
) {
  if (!dateValue) {
    return fallbackValue;
  }

  const time = new Date(dateValue).getTime();

  if (Number.isNaN(time)) {
    return fallbackValue;
  }

  return time;
}

export default function useHistorySort<TItem>({
  items,
  getDateValue,
  getAmountValue,
}: UseHistorySortOptions<TItem>) {
  const [sortValue, setSortValue] = useState<HistorySortValue>(
    HISTORY_SORT_VALUES.NEWEST,
  );

  const sortedItems = useMemo(() => {
    return [...items].sort((currentItem, nextItem) => {
      if (sortValue === HISTORY_SORT_VALUES.OLDEST) {
        const currentTime = getValidDateTime(
          getDateValue(currentItem),
          Number.POSITIVE_INFINITY,
        );

        const nextTime = getValidDateTime(
          getDateValue(nextItem),
          Number.POSITIVE_INFINITY,
        );

        return currentTime - nextTime;
      }

      if (sortValue === HISTORY_SORT_VALUES.HIGHEST_AMOUNT) {
        return getAmountValue(nextItem) - getAmountValue(currentItem);
      }

      if (sortValue === HISTORY_SORT_VALUES.LOWEST_AMOUNT) {
        return getAmountValue(currentItem) - getAmountValue(nextItem);
      }

      const currentTime = getValidDateTime(
        getDateValue(currentItem),
        Number.NEGATIVE_INFINITY,
      );

      const nextTime = getValidDateTime(
        getDateValue(nextItem),
        Number.NEGATIVE_INFINITY,
      );

      return nextTime - currentTime;
    });
  }, [items, sortValue, getDateValue, getAmountValue]);

  function resetSort() {
    setSortValue(HISTORY_SORT_VALUES.NEWEST);
  }

  return {
    sortValue,
    setSortValue,
    resetSort,
    sortedItems,
  };
}
