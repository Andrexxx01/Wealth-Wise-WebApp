import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const FREE_PLAN_RECORD_LIMIT = 50;

export type FinanceRecordResource =
  | "income"
  | "expense"
  | "investment"
  | "investmentV2"
  | "loan";

const resourceLabels: Record<FinanceRecordResource, string> = {
  income: "income",
  expense: "expense",
  investment: "investment",
  investmentV2: "investment",
  loan: "loan",
};

async function getFinanceRecordCount(
  userId: string,
  resource: FinanceRecordResource,
) {
  switch (resource) {
    case "income":
      return prisma.income.count({
        where: {
          userId,
        },
      });

    case "expense":
      return prisma.expense.count({
        where: {
          userId,
        },
      });

    case "investment":
      return prisma.investment.count({
        where: {
          userId,
        },
      });

    case "loan":
      return prisma.loan.count({
        where: {
          userId,
        },
      });

    case "investmentV2":
      return prisma.investmentTransaction.count({
        where: {
          userId,
        },
      });
  }
}

export async function enforceFinanceRecordLimit(
  userId: string,
  resource: FinanceRecordResource,
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      plan: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized.",
        code: "USER_NOT_FOUND",
      },
      {
        status: 401,
      },
    );
  }

  if (user.plan === "PRO") {
    return null;
  }

  const currentCount = await getFinanceRecordCount(userId, resource);

  if (currentCount < FREE_PLAN_RECORD_LIMIT) {
    return null;
  }

  const resourceLabel = resourceLabels[resource];

  return NextResponse.json(
    {
      message: `Free plan users can only create up to ${FREE_PLAN_RECORD_LIMIT} ${resourceLabel} records. Upgrade to Pro for unlimited records.`,
      code: "FREE_PLAN_LIMIT_REACHED",
      data: {
        plan: user.plan,
        resource,
        currentCount,
        limit: FREE_PLAN_RECORD_LIMIT,
      },
    },
    {
      status: 403,
    },
  );
}
