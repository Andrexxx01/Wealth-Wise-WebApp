import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { incomeApiSchema } from "@/features/income/schemas/income-api.schema";
import { serializeIncome } from "@/features/income/lib/income-serializer";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    incomeId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const { incomeId } = await context.params;

    const existingIncome = await prisma.income.findFirst({
      where: {
        id: incomeId,
        userId,
      },
    });

    if (!existingIncome) {
      return NextResponse.json(
        {
          message: "Income record not found.",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();
    const parsedBody = incomeApiSchema.parse(body);

    const updatedIncome = await prisma.income.update({
      where: {
        id: existingIncome.id,
      },
      data: {
        title: parsedBody.title,
        category: parsedBody.category,
        amount: parsedBody.amount,
        receivedAt: new Date(parsedBody.receivedAt),
        frequency: parsedBody.frequency,
        notes: parsedBody.notes ?? null,
      },
    });

    return NextResponse.json({
      data: serializeIncome(updatedIncome),
    });
  } catch (error) {
    console.error("PATCH /api/income/[incomeId] error:", error);

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
        message: "Failed to update income record.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const { incomeId } = await context.params;

    const existingIncome = await prisma.income.findFirst({
      where: {
        id: incomeId,
        userId,
      },
    });

    if (!existingIncome) {
      return NextResponse.json(
        {
          message: "Income record not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.income.delete({
      where: {
        id: existingIncome.id,
      },
    });

    return NextResponse.json({
      message: "Income record deleted successfully.",
      deletedId: incomeId,
    });
  } catch (error) {
    console.error("DELETE /api/income/[incomeId] error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete income record.",
      },
      {
        status: 500,
      },
    );
  }
}
