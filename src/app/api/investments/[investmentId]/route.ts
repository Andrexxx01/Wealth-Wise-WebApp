import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { investmentApiSchema } from "@/features/investments/schemas/investment-api.schema";
import { serializeInvestment } from "@/features/investments/lib/investment-serializer";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    investmentId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const { investmentId } = await context.params;

    const existingInvestment = await prisma.investment.findFirst({
      where: {
        id: investmentId,
        userId,
      },
    });

    if (!existingInvestment) {
      return NextResponse.json(
        {
          message: "Investment record not found.",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();
    const parsedBody = investmentApiSchema.parse(body);

    const updatedInvestment = await prisma.investment.update({
      where: {
        id: existingInvestment.id,
      },
      data: {
        assetName: parsedBody.assetName,
        category: parsedBody.category,
        investedAmount: parsedBody.investedAmount,
        currentValue: parsedBody.currentValue,
        currency: parsedBody.currency,
        investedAt: new Date(parsedBody.investedAt),
        notes: parsedBody.notes ?? null,
      },
    });

    return NextResponse.json({
      data: serializeInvestment(updatedInvestment),
    });
  } catch (error) {
    console.error("PATCH /api/investments/[investmentId] error:", error);

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
        message: "Failed to update investment record.",
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

    const { investmentId } = await context.params;

    const existingInvestment = await prisma.investment.findFirst({
      where: {
        id: investmentId,
        userId,
      },
    });

    if (!existingInvestment) {
      return NextResponse.json(
        {
          message: "Investment record not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.investment.delete({
      where: {
        id: existingInvestment.id,
      },
    });

    return NextResponse.json({
      message: "Investment record deleted successfully.",
      deletedId: investmentId,
    });
  } catch (error) {
    console.error("DELETE /api/investments/[investmentId] error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete investment record.",
      },
      {
        status: 500,
      },
    );
  }
}
