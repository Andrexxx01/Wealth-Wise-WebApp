import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { incomeApiSchema } from "@/features/income/schemas/income-api.schema";
import { serializeIncome } from "@/features/income/lib/income-serializer";
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

    const incomeItems = await prisma.income.findMany({
      where: {
        userId,
      },
      orderBy: {
        receivedAt: "desc",
      },
    });

    return NextResponse.json({
      data: incomeItems.map(serializeIncome),
    });
  } catch (error) {
    console.error("GET /api/income error:", error);

    return NextResponse.json(
      {
        message: "Failed to load income records.",
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
    const parsedBody = incomeApiSchema.parse(body);

    const limitResponse = await enforceFinanceRecordLimit(userId, "income");

    if (limitResponse) {
      return limitResponse;
    }

    const income = await prisma.income.create({
      data: {
        userId,
        title: parsedBody.title,
        category: parsedBody.category,
        amount: parsedBody.amount,
        receivedAt: new Date(parsedBody.receivedAt),
        frequency: parsedBody.frequency,
        notes: parsedBody.notes ?? null,
      },
    });

    return NextResponse.json(
      {
        data: serializeIncome(income),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/income error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid income payload.",
          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create income record.",
      },
      {
        status: 500,
      },
    );
  }
}
