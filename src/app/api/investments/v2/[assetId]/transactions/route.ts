import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { calculateInvestmentHolding } from "@/features/investments/lib/investment-holding-engine";
import { serializeInvestmentAssetWithTransactions } from "@/features/investments/lib/investment-v2-serializer";
import { createInvestmentTransactionV2Schema } from "@/features/investments/schemas/investment-v2-api.schema";

import { getAuthenticatedUserId } from "@/lib/api-auth";
import { enforceFinanceRecordLimit } from "@/lib/finance-plan-limit";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    assetId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const { assetId } = await context.params;

    // =====================================================
    // 1. VALIDATE REQUEST BODY
    // =====================================================

    const body: unknown = await request.json();

    const parsedBody = createInvestmentTransactionV2Schema.parse(body);

    // =====================================================
    // 2. LOAD ASSET + CURRENT TRANSACTIONS
    // =====================================================

    const asset = await prisma.investmentAsset.findFirst({
      where: {
        id: assetId,
        userId,
      },

      include: {
        transactions: true,
        events: true,
      },
    });

    if (!asset) {
      return NextResponse.json(
        {
          message: "Investment asset not found.",
        },
        {
          status: 404,
        },
      );
    }

    // =====================================================
    // 3. CALCULATE CURRENT HOLDING
    // =====================================================

    const serializedAsset = serializeInvestmentAssetWithTransactions(asset);

    const currentHolding = calculateInvestmentHolding(serializedAsset);

    // =====================================================
    // 4. VALIDATE TRANSACTION TYPE
    // =====================================================

    if (
      currentHolding.positionKind === "QUANTITY" &&
      parsedBody.type !== "BUY" &&
      parsedBody.type !== "SELL"
    ) {
      return NextResponse.json(
        {
          message:
            "Quantity-based investments only support BUY and SELL transactions.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      currentHolding.positionKind === "PRINCIPAL" &&
      parsedBody.type !== "OPEN" &&
      parsedBody.type !== "CLOSE"
    ) {
      return NextResponse.json(
        {
          message:
            "Principal-based investments only support OPEN and CLOSE transactions.",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================================
    // 5. PREVENT MIXED TRANSACTION CURRENCIES
    // =====================================================

    const normalizedCurrencyCode = parsedBody.currencyCode.trim().toUpperCase();

    if (
      currentHolding.transactionCurrencyCode !== null &&
      currentHolding.transactionCurrencyCode !== normalizedCurrencyCode
    ) {
      return NextResponse.json(
        {
          message: `This investment currently uses ${currentHolding.transactionCurrencyCode}. Mixed transaction currencies are not supported yet.`,
        },
        {
          status: 400,
        },
      );
    }

    // =====================================================
    // 6. PREVENT OVERSELL
    // =====================================================

    if (parsedBody.type === "SELL") {
      const currentQuantity = currentHolding.quantity ?? 0;

      const sellQuantity = parsedBody.quantity ?? 0;

      if (sellQuantity > currentQuantity) {
        return NextResponse.json(
          {
            message:
              "Sell quantity cannot exceed the current holding quantity.",

            data: {
              currentQuantity,
              requestedQuantity: sellQuantity,
            },
          },
          {
            status: 400,
          },
        );
      }
    }

    // =====================================================
    // 7. PREVENT OVER-CLOSE
    // =====================================================

    if (parsedBody.type === "CLOSE") {
      const currentPrincipal = currentHolding.principalBalance ?? 0;

      if (parsedBody.grossAmount > currentPrincipal) {
        return NextResponse.json(
          {
            message:
              "Close amount cannot exceed the current principal balance.",

            data: {
              currentPrincipal,
              requestedAmount: parsedBody.grossAmount,
            },
          },
          {
            status: 400,
          },
        );
      }
    }

    // =====================================================
    // 8. FREE / PRO PLAN LIMIT
    // =====================================================

    const limitResponse = await enforceFinanceRecordLimit(
      userId,
      "investmentV2",
    );

    if (limitResponse) {
      return limitResponse;
    }

    // =====================================================
    // 9. CREATE TRANSACTION
    // =====================================================

    const createdTransaction = await prisma.investmentTransaction.create({
      data: {
        userId,

        assetId,

        type: parsedBody.type,

        quantity: parsedBody.quantity ?? null,

        grossAmount: parsedBody.grossAmount,

        feeAmount: parsedBody.feeAmount,

        currencyCode: normalizedCurrencyCode,

        transactedAt: new Date(parsedBody.transactedAt),

        notes: parsedBody.notes ?? null,
      },
    });

    return NextResponse.json(
      {
        data: {
          id: createdTransaction.id,

          assetId: createdTransaction.assetId,

          userId: createdTransaction.userId,

          type: createdTransaction.type,

          quantity:
            createdTransaction.quantity === null
              ? null
              : Number(createdTransaction.quantity),

          grossAmount: Number(createdTransaction.grossAmount),

          feeAmount: Number(createdTransaction.feeAmount),

          currencyCode: createdTransaction.currencyCode,

          transactedAt: createdTransaction.transactedAt.toISOString(),

          notes: createdTransaction.notes,

          createdAt: createdTransaction.createdAt.toISOString(),

          updatedAt: createdTransaction.updatedAt.toISOString(),
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/investments/v2/[assetId]/transactions error:",
      error,
    );

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid investment transaction payload.",

          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create investment transaction.",
      },
      {
        status: 500,
      },
    );
  }
}
