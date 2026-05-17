import type { ReactNode } from "react";

export type SummaryCardTone = "default" | "positive" | "warning" | "danger";

export type SummaryCardProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: SummaryCardTone;
};

export type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export type BarChartItem = {
  label: string;
  value: number;
};

export type GroupedBarChartItem = {
  label: string;
  primaryValue: number;
  secondaryValue: number;
};

export type ChartCardProps = {
  eyebrow?: string;
  title: string;
  badge?: string;
  children: ReactNode;
};

export type BarChartMockProps = {
  data: BarChartItem[];
};

export type GroupedBarChartMockProps = {
  data: GroupedBarChartItem[];
  primaryLabel?: string;
  secondaryLabel?: string;
};

export type DashboardCardHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  className?: string;
};