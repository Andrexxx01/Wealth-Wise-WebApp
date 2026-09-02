import { NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

import type { InvestmentRecentTransactionV2Item } from "@/types/investment-v2";

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
      },

      include: {
        asset: {
          select: {
            name: true,
            symbol: true,
            category: true,
            instrumentType: true,
          },
        },
      },

      orderBy: [
        {
          transactedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],

      take: 10,
    });

    const data: InvestmentRecentTransactionV2Item[] = transactions.map(
      (transaction) => ({
        id: transaction.id,

        assetId: transaction.assetId,

        assetName: transaction.asset.name,

        assetSymbol: transaction.asset.symbol,

        category: transaction.asset.category,

        instrumentType: transaction.asset.instrumentType,

        type: transaction.type,

        quantity:
          transaction.quantity === null ? null : Number(transaction.quantity),

        grossAmount: Number(transaction.grossAmount),

        feeAmount: Number(transaction.feeAmount),

        currencyCode: transaction.currencyCode,

        transactedAt: transaction.transactedAt.toISOString(),

        notes: transaction.notes,
      }),
    );

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("GET /api/investments/v2/transactions error:", error);

    return NextResponse.json(
      {
        message: "Failed to load investment transactions.",
      },
      {
        status: 500,
      },
    );
  }
}
