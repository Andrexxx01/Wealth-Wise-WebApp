export const HISTORY_SORT_VALUES = {
  NEWEST: "NEWEST",
  OLDEST: "OLDEST",
  HIGHEST_AMOUNT: "HIGHEST_AMOUNT",
  LOWEST_AMOUNT: "LOWEST_AMOUNT",
} as const;

export type HistorySortValue =
  (typeof HISTORY_SORT_VALUES)[keyof typeof HISTORY_SORT_VALUES];

export const historySortOptions = [
  { value: HISTORY_SORT_VALUES.NEWEST, label: "Newest first" },
  { value: HISTORY_SORT_VALUES.OLDEST, label: "Oldest first" },
  { value: HISTORY_SORT_VALUES.HIGHEST_AMOUNT, label: "Highest amount" },
  { value: HISTORY_SORT_VALUES.LOWEST_AMOUNT, label: "Lowest amount" },
] as const;
