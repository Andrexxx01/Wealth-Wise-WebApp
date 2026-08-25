import { NextResponse } from "next/server";

import { serializeInvestmentAssetWithTransactions } from "@/features/investments/lib/investment-v2-serializer";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const investmentAssets = await prisma.investmentAsset.findMany({
      where: {
        userId,
      },

      include: {
        transactions: {
          orderBy: {
            transactedAt: "desc",
          },
        },

        events: {
          orderBy: {
            occurredAt: "desc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      data: investmentAssets.map(serializeInvestmentAssetWithTransactions),
    });
  } catch (error) {
    console.error("GET /api/investments/v2 error:", error);

    return NextResponse.json(
      {
        message: "Failed to load investment assets.",
      },
      {
        status: 500,
      },
    );
  }
}
