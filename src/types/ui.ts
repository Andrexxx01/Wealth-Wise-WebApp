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
