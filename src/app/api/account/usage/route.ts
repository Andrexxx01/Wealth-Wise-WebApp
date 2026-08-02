import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { FREE_PLAN_RECORD_LIMIT } from "@/lib/finance-plan-limit";
import { prisma } from "@/lib/prisma";
import type {
  FinanceUsageItem,
  FinanceUsageResource,
} from "@/types/account-usage";
import type { UserPlan } from "@/types/user-subscription";

export const runtime = "nodejs";

type CreateUsageItemOptions = {
  resource: FinanceUsageResource;
  label: string;
  currentCount: number;
  plan: UserPlan;
};

function createUsageItem({
  resource,
  label,
  currentCount,
  plan,
}: CreateUsageItemOptions): FinanceUsageItem {
  const isUnlimited = plan === "PRO";
  const limit = isUnlimited ? null : FREE_PLAN_RECORD_LIMIT;

  const remaining = limit === null ? null : Math.max(limit - currentCount, 0);

  return {
    resource,
    label,
    currentCount,
    limit,
    remaining,
    isUnlimited,
    hasReachedLimit: limit !== null && currentCount >= limit,
  };
}

export async function GET() {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const [user, incomeCount, expenseCount, investmentCount, loanCount] =
      await Promise.all([
        prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            plan: true,
            subscriptionStatus: true,
          },
        }),

        prisma.income.count({
          where: {
            userId,
          },
        }),

        prisma.expense.count({
          where: {
            userId,
          },
        }),

        prisma.investment.count({
          where: {
            userId,
          },
        }),

        prisma.loan.count({
          where: {
            userId,
          },
        }),
      ]);

    if (!user) {
      return NextResponse.json(
        {
          message: "User account not found.",
          code: "USER_NOT_FOUND",
        },
        {
          status: 404,
        },
      );
    }

    const incomeUsage = createUsageItem({
      resource: "income",
      label: "Income",
      currentCount: incomeCount,
      plan: user.plan,
    });

    const expenseUsage = createUsageItem({
      resource: "expense",
      label: "Expenses",
      currentCount: expenseCount,
      plan: user.plan,
    });

    const investmentUsage = createUsageItem({
      resource: "investment",
      label: "Investments",
      currentCount: investmentCount,
      plan: user.plan,
    });

    const loanUsage = createUsageItem({
      resource: "loan",
      label: "Loans",
      currentCount: loanCount,
      plan: user.plan,
    });

    return NextResponse.json({
      data: {
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
        totalRecords: incomeCount + expenseCount + investmentCount + loanCount,
        limitPerResource: user.plan === "PRO" ? null : FREE_PLAN_RECORD_LIMIT,
        usage: {
          income: incomeUsage,
          expense: expenseUsage,
          investment: investmentUsage,
          loan: loanUsage,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/account/usage error:", error);

    return NextResponse.json(
      {
        message: "Failed to load account usage.",
      },
      {
        status: 500,
      },
    );
  }
}
