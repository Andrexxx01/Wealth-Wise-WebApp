export type FinanceMonthBucket = {
  key: string;
  label: string;
};

export const DEFAULT_RECENT_MONTH_COUNT = 6;

function parseDateValue(dateValue: string | Date | null | undefined) {
  if (!dateValue) {
    return null;
  }

  const date =
    dateValue instanceof Date ? new Date(dateValue) : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function getFinanceMonthKey(
  dateValue: string | Date | null | undefined,
) {
  const date = parseDateValue(dateValue);

  if (!date) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

export function isDateInReferenceMonth(
  dateValue: string | Date | null | undefined,
  referenceDate = new Date(),
) {
  const date = parseDateValue(dateValue);

  if (!date) {
    return false;
  }

  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth()
  );
}

export function filterItemsByReferenceMonth<T>(
  items: T[],
  getDateValue: (item: T) => string | Date | null | undefined,
  referenceDate = new Date(),
) {
  return items.filter((item) =>
    isDateInReferenceMonth(getDateValue(item), referenceDate),
  );
}

export function buildRecentFinanceMonthBuckets(
  referenceDate = new Date(),
  monthCount = DEFAULT_RECENT_MONTH_COUNT,
): FinanceMonthBucket[] {
  return Array.from({ length: monthCount }, (_, index) => {
    const monthsAgo = monthCount - 1 - index;

    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - monthsAgo,
      1,
    );

    const year = date.getFullYear();
    const monthIndex = date.getMonth();

    const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

    const monthLabel = date.toLocaleString("en-US", {
      month: "short",
    });

    const shortYear = String(year).slice(-2);

    return {
      key,
      label: `${monthLabel} '${shortYear}`,
    };
  });
}

export function findFinanceMonthBucketIndex(
  monthBuckets: FinanceMonthBucket[],
  dateValue: string | Date | null | undefined,
) {
  const monthKey = getFinanceMonthKey(dateValue);

  if (!monthKey) {
    return -1;
  }

  return monthBuckets.findIndex((bucket) => bucket.key === monthKey);
}

export function getElapsedDaysInReferenceMonth(referenceDate = new Date()) {
  return Math.max(referenceDate.getDate(), 1);
}

export function getRecentFinanceMonthRangeLabel(referenceDate = new Date()) {
  const buckets = buildRecentFinanceMonthBuckets(referenceDate);

  const first = buckets[0];
  const last = buckets[buckets.length - 1];

  if (!first || !last) {
    return "Recent months";
  }

  return `${first.label} – ${last.label}`;
}
