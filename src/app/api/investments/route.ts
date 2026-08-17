import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { investmentApiSchema } from "@/features/investments/schemas/investment-api.schema";
import { serializeInvestment } from "@/features/investments/lib/investment-serializer";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { enforceFinanceRecordLimit } from "@/lib/finance-plan-limit";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const investmentItems = await prisma.investment.findMany({
      where: {
        userId,
      },
      orderBy: {
        investedAt: "desc",
      },
    });

    return NextResponse.json({
      data: investmentItems.map(serializeInvestment),
    });
  } catch (error) {
    console.error("GET /api/investments error:", error);

    return NextResponse.json(
      {
        message: "Failed to load investment records.",
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

    const body = await request.json();
    const parsedBody = investmentApiSchema.parse(body);

    const limitResponse = await enforceFinanceRecordLimit(userId, "investment");

    if (limitResponse) {
      return limitResponse;
    }

    const investment = await prisma.investment.create({
      data: {
        userId,

        assetName: parsedBody.assetName,
        symbol: parsedBody.symbol ?? null,
        category: parsedBody.category,

        investedAmount: parsedBody.investedAmount,
        quantity: parsedBody.quantity,
        feeAmount: parsedBody.feeAmount,
        currency: parsedBody.currency,

        // Temporary compatibility only.
        // Akan dihapus bersama kolom currentValue.
        currentValue: parsedBody.investedAmount,

        investedAt: new Date(parsedBody.investedAt),
        notes: parsedBody.notes ?? null,
      },
    });

    return NextResponse.json(
      {
        data: serializeInvestment(investment),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/investments error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid investment payload.",
          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create investment record.",
      },
      {
        status: 500,
      },
    );
  }
}
