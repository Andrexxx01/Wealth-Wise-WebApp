import { NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

import type { InvestmentContributionV2Item } from "@/types/investment-v2";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const transactions = await prisma.investmentTransaction.findMany({
      where: {
        userId,

        type: {
          in: ["BUY", "OPEN"],
        },
      },

      orderBy: [
        {
          transactedAt: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

    const data: InvestmentContributionV2Item[] = transactions.map(
      (transaction) => ({
        id: transaction.id,

        type: transaction.type as "BUY" | "OPEN",

        grossAmount: Number(transaction.grossAmount),

        feeAmount: Number(transaction.feeAmount),

        currencyCode: transaction.currencyCode,

        transactedAt: transaction.transactedAt.toISOString(),
      }),
    );

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("GET /api/investments/v2/contributions error:", error);

    return NextResponse.json(
      {
        message: "Failed to load investment contributions.",
      },
      {
        status: 500,
      },
    );
  }
}
