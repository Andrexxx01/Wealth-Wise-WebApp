import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { serializeInvestment } from "@/features/investments/lib/investment-serializer";
import { investmentApiSchema } from "@/features/investments/schemas/investment-api.schema";
import { getDemoUserId } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const userId = await getDemoUserId();

    const investments = await prisma.investment.findMany({
      where: {
        userId,
      },
      orderBy: {
        investedAt: "desc",
      },
    });

    return NextResponse.json({
      data: investments.map(serializeInvestment),
    });
  } catch (error) {
    console.error("GET /api/investments error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch investment records.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = investmentApiSchema.parse(body);

    const userId = await getDemoUserId();

    const investment = await prisma.investment.create({
      data: {
        userId,
        assetName: parsedBody.assetName,
        category: parsedBody.category,
        investedAmount: parsedBody.investedAmount,
        currentValue: parsedBody.currentValue,
        investedAt: new Date(parsedBody.investedAt),
        notes: parsedBody.notes?.trim() ? parsedBody.notes.trim() : null,
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
