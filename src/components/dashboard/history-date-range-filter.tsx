"use client";

import HistoryDateFilter from "@/components/dashboard/history-date-filter";

type HistoryDateRangeFilterProps = {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  fromLabel?: string;
  toLabel?: string;
};

export default function HistoryDateRangeFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  fromLabel = "Date From",
  toLabel = "Date To",
}: HistoryDateRangeFilterProps) {
  return (
    <>
      <HistoryDateFilter
        label={fromLabel}
        value={dateFrom}
        onChange={onDateFromChange}
      />

      <HistoryDateFilter
        label={toLabel}
        value={dateTo}
        onChange={onDateToChange}
      />
    </>
  );
}
