"use client";

import Link from "next/link";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAccountUsage } from "@/features/subscription/hooks/use-account-usage";
import PlanBadge from "@/features/subscription/components/plan-badge";
import type { FinanceUsageItem } from "@/types/account-usage";

type UsageProgressItemProps = {
  item: FinanceUsageItem;
};

function UsageProgressItem({ item }: UsageProgressItemProps) {
  const percentage =
    item.limit === null
      ? 100
      : Math.min((item.currentCount / item.limit) * 100, 100);

  const usageLabel = item.isUnlimited
    ? `${item.currentCount} records · Unlimited`
    : `${item.currentCount} / ${item.limit}`;

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-900">{item.label}</p>

          <p className="mt-1 text-sm font-medium text-slate-500">
            {usageLabel}
          </p>
        </div>

        {item.isUnlimited ? (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Unlimited
          </span>
        ) : item.hasReachedLimit ? (
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
            Limit reached
          </span>
        ) : (
          <span className="text-xs font-bold text-slate-500">
            {item.remaining} remaining
          </span>
        )}
      </div>

      {!item.isUnlimited && (
        <div className="mt-4">
          <div
            role="progressbar"
            aria-label={`${item.label} record usage`}
            aria-valuemin={0}
            aria-valuemax={item.limit ?? undefined}
            aria-valuenow={item.currentCount}
            className="h-2.5 overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className={
                item.hasReachedLimit
                  ? "h-full rounded-full bg-red-500 transition-all"
                  : percentage >= 80
                    ? "h-full rounded-full bg-amber-500 transition-all"
                    : "h-full rounded-full bg-emerald-500 transition-all"
              }
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{Math.round(percentage)}% used</span>
            <span>{item.limit} maximum</span>
          </div>
        </div>
      )}
    </div>
  );
}

function AccountUsageLoading() {
  return (
    <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
      <CardContent className="p-6">
        <DashboardCardHeader
          eyebrow="Plan Usage"
          title="Account record usage"
          description="Loading your current account usage."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-[24px] bg-slate-100"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AccountUsageSection() {
  const { accountUsage, isLoading, error, reloadAccountUsage } =
    useAccountUsage();

  if (isLoading) {
    return <AccountUsageLoading />;
  }

  if (error || !accountUsage) {
    return (
      <Card className="rounded-[32px] border-red-200 bg-white shadow-none">
        <CardContent className="p-6">
          <DashboardCardHeader
            eyebrow="Plan Usage"
            title="Unable to load account usage"
            description={
              error ?? "The account usage information is currently unavailable."
            }
          />

          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-2xl"
            onClick={() => void reloadAccountUsage()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const usageItems = [
    accountUsage.usage.income,
    accountUsage.usage.expense,
    accountUsage.usage.investment,
    accountUsage.usage.loan,
  ];

  const hasReachedAnyLimit = usageItems.some((item) => item.hasReachedLimit);

  return (
    <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
      <CardContent className="p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <DashboardCardHeader
            eyebrow="Plan Usage"
            title="Account record usage"
            description={
              accountUsage.plan === "PRO"
                ? "Your Pro plan includes unlimited finance records."
                : `Your Free plan includes up to ${accountUsage.limitPerResource} records for each finance category.`
            }
          />

          <div className="flex shrink-0 items-center gap-3">
            <PlanBadge plan={accountUsage.plan} />

            {accountUsage.plan === "FREE" && (
              <Button
                asChild
                className="h-10 rounded-xl bg-emerald-600 px-4 font-semibold text-white hover:bg-emerald-700"
              >
                <Link href="/pricing">Upgrade to Pro</Link>
              </Button>
            )}
          </div>
        </div>

        {hasReachedAnyLimit && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-bold text-red-700">
              One or more record limits have been reached.
            </p>

            <p className="mt-1 text-sm leading-6 text-red-600">
              Delete an existing record or upgrade to Pro before creating
              additional records in that category.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {usageItems.map((item) => (
            <UsageProgressItem key={item.resource} item={item} />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">
              Total finance records
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Combined records across all finance categories.
            </p>
          </div>

          <p className="text-2xl font-black tracking-tight text-slate-900">
            {accountUsage.totalRecords}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
