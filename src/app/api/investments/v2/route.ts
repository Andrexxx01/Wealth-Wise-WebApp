import { NextResponse } from "next/server";

import { serializeInvestmentAssetWithTransactions } from "@/features/investments/lib/investment-v2-serializer";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";

import { createInvestmentAssetV2Schema } from "@/features/investments/schemas/investment-v2-api.schema";
import { enforceFinanceRecordLimit } from "@/lib/finance-plan-limit";

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

export async function POST(request: Request) {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const body: unknown = await request.json();

    const parsedBody = createInvestmentAssetV2Schema.parse(body);

    const limitResponse = await enforceFinanceRecordLimit(
      userId,
      "investmentV2",
    );

    if (limitResponse) {
      return limitResponse;
    }

    const createdAsset = await prisma.$transaction(async (transaction) => {
      const asset = await transaction.investmentAsset.create({
        data: {
          userId,

          name: parsedBody.name,

          category: parsedBody.category,

          instrumentType: parsedBody.instrumentType,

          valuationType: parsedBody.valuationType,

          symbol: parsedBody.symbol,

          exchange: parsedBody.exchange,

          isin: parsedBody.isin,

          issuer: parsedBody.issuer,

          underlyingIndex: parsedBody.underlyingIndex,

          unit: parsedBody.unit,

          pricingUnit: parsedBody.pricingUnit,

          marketCurrencyCode: parsedBody.marketCurrencyCode,

          annualInterestRate: parsedBody.annualInterestRate,

          couponRate: parsedBody.couponRate,

          faceValue: parsedBody.faceValue,

          maturityDate: parsedBody.maturityDate
            ? new Date(parsedBody.maturityDate)
            : null,

          notes: parsedBody.notes,
        },
      });

      await transaction.investmentTransaction.create({
        data: {
          userId,

          assetId: asset.id,

          type: parsedBody.initialTransaction.type,

          quantity: parsedBody.initialTransaction.quantity,

          grossAmount: parsedBody.initialTransaction.grossAmount,

          feeAmount: parsedBody.initialTransaction.feeAmount,

          currencyCode: parsedBody.initialTransaction.currencyCode,

          transactedAt: new Date(parsedBody.initialTransaction.transactedAt),

          notes: parsedBody.initialTransaction.notes,
        },
      });

      return transaction.investmentAsset.findUniqueOrThrow({
        where: {
          id: asset.id,
        },

        include: {
          transactions: true,
          events: true,
        },
      });
    });

    return NextResponse.json(
      {
        data: serializeInvestmentAssetWithTransactions(createdAsset),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/investments/v2 error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid investment V2 payload.",

          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create investment asset.",
      },
      {
        status: 500,
      },
    );
  }
}
