"use client";

import Link from "next/link";
import EmptyState from "@/components/dashboard/empty-state";
import SectionHeader from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { HistoryPageShellProps } from "@/types/history-page-shell";

export default function HistoryPageShell({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
  isEmpty,
  emptyTitle,
  emptyDescription,
  emptyActionHref,
  emptyActionLabel,
  children,
}: HistoryPageShellProps) {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-2xl border-slate-300 bg-white px-6 font-semibold text-slate-900 hover:bg-slate-100"
          >
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        }
      />

      <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
        <CardContent className="p-6">
          {isEmpty ? (
            <EmptyState
              title={emptyTitle}
              description={emptyDescription}
              action={
                <Button
                  asChild
                  className="h-11 rounded-2xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-700"
                >
                  <Link href={emptyActionHref}>{emptyActionLabel}</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">{children}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
