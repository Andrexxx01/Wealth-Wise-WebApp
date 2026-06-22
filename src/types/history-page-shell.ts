import type { ReactNode } from "react";

export type HistoryPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  emptyActionHref: string;
  emptyActionLabel: string;
  children: ReactNode;
};
