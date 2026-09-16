import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { serializeInvestmentAssetWithTransactions } from "@/features/investments/lib/investment-v2-serializer";

import { updateInvestmentAssetV2Schema } from "@/features/investments/schemas/investment-v2-api.schema";

import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    assetId: string;
  }>;
};

// =====================================================
// PATCH INVESTMENT ASSET
// =====================================================

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const authResult =
      await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const { assetId } =
      await context.params;

    // =================================================
    // 1. VALIDATE REQUEST BODY
    // =================================================

    const body: unknown =
      await request.json();

    const parsedBody =
      updateInvestmentAssetV2Schema.parse(
        body,
      );

    // =================================================
    // 2. FIND ASSET OWNED BY CURRENT USER
    // =================================================

    const existingAsset =
      await prisma.investmentAsset.findFirst({
        where: {
          id: assetId,
          userId,
        },
      });

    if (!existingAsset) {
      return NextResponse.json(
        {
          message:
            "Investment asset not found.",
          code: "INVESTMENT_ASSET_NOT_FOUND",
        },
        {
          status: 404,
        },
      );
    }

    // =================================================
    // 3. VALIDATE SYMBOL REQUIREMENT
    // =================================================

    const nextSymbol =
      parsedBody.symbol !== undefined
        ? parsedBody.symbol
        : existingAsset.symbol;

    const requiresSymbol =
      existingAsset.instrumentType ===
        "CRYPTO_ASSET" ||
      existingAsset.instrumentType ===
        "COMMON_STOCK" ||
      existingAsset.instrumentType ===
        "ETF";

    if (
      requiresSymbol &&
      !nextSymbol
    ) {
      return NextResponse.json(
        {
          message:
            "This investment instrument requires a symbol.",
          code:
            "INVESTMENT_SYMBOL_REQUIRED",
        },
        {
          status: 400,
        },
      );
    }

    // =================================================
    // 4. UPDATE ASSET
    // =================================================

    const updatedAsset =
      await prisma.investmentAsset.update({
        where: {
          id: assetId,
        },

        data: {
          ...(parsedBody.name !== undefined
            ? {
                name: parsedBody.name,
              }
            : {}),

          ...(parsedBody.symbol !== undefined
            ? {
                symbol: parsedBody.symbol,
              }
            : {}),

          ...(parsedBody.exchange !== undefined
            ? {
                exchange:
                  parsedBody.exchange,
              }
            : {}),

          ...(parsedBody.isin !== undefined
            ? {
                isin: parsedBody.isin,
              }
            : {}),

          ...(parsedBody.issuer !== undefined
            ? {
                issuer:
                  parsedBody.issuer,
              }
            : {}),

          ...(parsedBody.underlyingIndex !==
          undefined
            ? {
                underlyingIndex:
                  parsedBody.underlyingIndex,
              }
            : {}),

          ...(parsedBody.notes !== undefined
            ? {
                notes: parsedBody.notes,
              }
            : {}),
        },

        include: {
          transactions: true,
          events: true,
        },
      });

    // =================================================
    // 5. SUCCESS
    // =================================================

    return NextResponse.json({
      data:
        serializeInvestmentAssetWithTransactions(
          updatedAsset,
        ),
    });
  } catch (error) {
    console.error(
      "PATCH /api/investments/v2/[assetId] error:",
      error,
    );

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message:
            "Invalid investment asset update payload.",

          errors:
            error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message:
          "Failed to update investment asset.",
      },
      {
        status: 500,
      },
    );
  }
}

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
