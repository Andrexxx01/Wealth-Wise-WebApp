import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { serializeInvestment } from "@/features/investments/lib/investment-serializer";
import { investmentApiSchema } from "@/features/investments/schemas/investment-api.schema";
import { getDemoUserId } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    investmentId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { investmentId } = await context.params;
    const body = await request.json();
    const parsedBody = investmentApiSchema.parse(body);

    const userId = await getDemoUserId();

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

    const updatedInvestment = await prisma.investment.update({
      where: {
        id: investmentId,
      },
      data: {
        assetName: parsedBody.assetName,
        category: parsedBody.category,
        investedAmount: parsedBody.investedAmount,
        currentValue: parsedBody.currentValue,
        investedAt: new Date(parsedBody.investedAt),
        notes: parsedBody.notes?.trim() ? parsedBody.notes.trim() : null,
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
    const { investmentId } = await context.params;
    const userId = await getDemoUserId();

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
        id: investmentId,
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
