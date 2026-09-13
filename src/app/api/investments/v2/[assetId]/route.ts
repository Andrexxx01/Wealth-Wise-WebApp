import { NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    assetId: string;
  }>;
};

// =====================================================
// DELETE INVESTMENT ASSET
// =====================================================

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const { assetId } = await context.params;

    // =================================================
    // DELETE ONLY IF ASSET BELONGS TO CURRENT USER
    // =================================================

    const deleteResult = await prisma.investmentAsset.deleteMany({
      where: {
        id: assetId,
        userId,
      },
    });

    // =================================================
    // ASSET NOT FOUND / NOT OWNED BY USER
    // =================================================

    if (deleteResult.count === 0) {
      return NextResponse.json(
        {
          message: "Investment asset not found.",
          code: "INVESTMENT_ASSET_NOT_FOUND",
        },
        {
          status: 404,
        },
      );
    }

    // =================================================
    // SUCCESS
    // =================================================

    return NextResponse.json({
      data: {
        id: assetId,
      },
    });
  } catch (error) {
    console.error("DELETE /api/investments/v2/[assetId] error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete investment asset.",
      },
      {
        status: 500,
      },
    );
  }
}
