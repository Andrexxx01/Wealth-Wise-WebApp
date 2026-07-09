import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { expenseApiSchema } from "@/features/expenses/schemas/expense-api.schema";
import { serializeExpense } from "@/features/expenses/lib/expense-serializer";
import { getDemoUserId } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const userId = await getDemoUserId();

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
      },
      orderBy: {
        spentAt: "desc",
      },
    });

    return NextResponse.json({
      data: expenses.map(serializeExpense),
    });
  } catch (error) {
    console.error("GET /api/expenses error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch expense records.",
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
    const parsedBody = expenseApiSchema.parse(body);

    const userId = await getDemoUserId();

    const expense = await prisma.expense.create({
      data: {
        userId,
        title: parsedBody.title,
        category: parsedBody.category,
        type: parsedBody.type,
        amount: parsedBody.amount,
        spentAt: new Date(parsedBody.spentAt),
        notes: parsedBody.notes?.trim() ? parsedBody.notes.trim() : null,
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
