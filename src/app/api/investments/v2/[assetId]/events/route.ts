import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { calculateInvestmentHolding } from "@/features/investments/lib/investment-holding-engine";

import {
  serializeInvestmentAssetWithTransactions,
  serializeInvestmentEvent,
} from "@/features/investments/lib/investment-v2-serializer";

import { createInvestmentEventV2Schema } from "@/features/investments/schemas/investment-v2-api.schema";

import { getAuthenticatedUserId } from "@/lib/api-auth";

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

    const parsedBody = createInvestmentEventV2Schema.parse(body);

    // =====================================================
    // 2. LOAD ASSET
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
          code: "INVESTMENT_ASSET_NOT_FOUND",
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
    // 4. VALIDATE EVENT TYPE AGAINST ASSET
    // =====================================================

    const isDeposit = asset.instrumentType === "DEPOSIT";

    const isBond = asset.instrumentType === "BOND";

    if (
      isDeposit &&
      parsedBody.type !== "INTEREST" &&
      parsedBody.type !== "MATURITY"
    ) {
      return NextResponse.json(
        {
          message:
            "Deposit assets currently support only INTEREST and MATURITY events.",
          code: "UNSUPPORTED_INVESTMENT_EVENT",
        },
        {
          status: 400,
        },
      );
    }

    if (
      isBond &&
      parsedBody.type !== "COUPON" &&
      parsedBody.type !== "MATURITY"
    ) {
      return NextResponse.json(
        {
          message:
            "Bond assets currently support only COUPON and MATURITY events.",
          code: "UNSUPPORTED_INVESTMENT_EVENT",
        },
        {
          status: 400,
        },
      );
    }

    if (!isDeposit && !isBond) {
      return NextResponse.json(
        {
          message:
            "Investment events are not supported for this instrument yet.",
          code: "UNSUPPORTED_INVESTMENT_EVENT",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================================
    // 5. VALIDATE CASH EVENT CURRENCY
    // =====================================================

    const isCashEvent =
      parsedBody.type === "INTEREST" || parsedBody.type === "COUPON";

    const normalizedCurrencyCode =
      parsedBody.currencyCode?.trim().toUpperCase() ?? null;

    if (
      isCashEvent &&
      currentHolding.transactionCurrencyCode !== null &&
      normalizedCurrencyCode !== currentHolding.transactionCurrencyCode
    ) {
      return NextResponse.json(
        {
          message: `This investment currently uses ${currentHolding.transactionCurrencyCode}. Event income in another currency is not supported yet.`,
          code: "INVESTMENT_EVENT_CURRENCY_MISMATCH",
        },
        {
          status: 400,
        },
      );
    }

    // =====================================================
    // 6. PREVENT DUPLICATE MATURITY
    // =====================================================

    if (parsedBody.type === "MATURITY") {
      const existingMaturity = asset.events.some(
        (event) => event.type === "MATURITY",
      );

      if (existingMaturity) {
        return NextResponse.json(
          {
            message: "This investment already has a maturity event.",
            code: "INVESTMENT_MATURITY_ALREADY_RECORDED",
          },
          {
            status: 409,
          },
        );
      }
    }

    // =====================================================
    // 7. CREATE EVENT
    // =====================================================

    const createdEvent = await prisma.investmentEvent.create({
      data: {
        userId,

        assetId,

        type: parsedBody.type,

        grossAmount: parsedBody.grossAmount ?? null,

        feeAmount: parsedBody.feeAmount,

        taxAmount: parsedBody.taxAmount,

        currencyCode: normalizedCurrencyCode,

        occurredAt: new Date(parsedBody.occurredAt),

        notes: parsedBody.notes ?? null,
      },
    });

    // =====================================================
    // 8. RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        data: serializeInvestmentEvent(createdEvent),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/investments/v2/[assetId]/events error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid investment event payload.",

          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create investment event.",
      },
      {
        status: 500,
      },
    );
  }
}
