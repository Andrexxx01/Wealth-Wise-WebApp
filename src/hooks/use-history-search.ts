"use client";

import { useMemo, useState } from "react";

type HistorySearchMatcher<TItem> = (
  item: TItem,
  searchQuery: string,
) => boolean;

export default function useHistorySearch<TItem>(
  items: TItem[],
  matcher: HistorySearchMatcher<TItem>,
) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => matcher(item, searchQuery));
  }, [items, matcher, searchQuery]);

  const hasSearchQuery = searchQuery.trim().length > 0;

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    hasSearchQuery,
  };
}
