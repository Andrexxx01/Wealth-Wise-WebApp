import { NextResponse } from "next/server";

import { calculateInvestmentHolding } from "@/features/investments/lib/investment-holding-engine";
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
        transactions: true,
        events: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const holdings = investmentAssets.map((asset) => {
      const serializedAsset = serializeInvestmentAssetWithTransactions(asset);

      return calculateInvestmentHolding(serializedAsset);
    });

    return NextResponse.json({
      data: holdings,
    });
  } catch (error) {
    console.error("GET /api/investments/v2/holdings error:", error);

    return NextResponse.json(
      {
        message: "Failed to calculate investment holdings.",
      },
      {
        status: 500,
      },
    );
  }
}
