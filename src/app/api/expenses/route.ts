import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { expenseApiSchema } from "@/features/expenses/schemas/expense-api.schema";
import { serializeExpense } from "@/features/expenses/lib/expense-serializer";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const expenseItems = await prisma.expense.findMany({
      where: {
        userId,
      },
      orderBy: {
        spentAt: "desc",
      },
    });

    return NextResponse.json({
      data: expenseItems.map(serializeExpense),
    });
  } catch (error) {
    console.error("GET /api/expenses error:", error);

    return NextResponse.json(
      {
        message: "Failed to load expense records.",
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
    const parsedBody = expenseApiSchema.parse(body);

    const expense = await prisma.expense.create({
      data: {
        userId,
        title: parsedBody.title,
        category: parsedBody.category,
        type: parsedBody.type,
        amount: parsedBody.amount,
        spentAt: new Date(parsedBody.spentAt),
        notes: parsedBody.notes ?? null,
      },
    });

    return NextResponse.json(
      {
        data: serializeExpense(expense),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/expenses error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid expense payload.",
          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create expense record.",
      },
      {
        status: 500,
      },
    );
  }
}
