import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { expenseApiSchema } from "@/features/expenses/schemas/expense-api.schema";
import { serializeExpense } from "@/features/expenses/lib/expense-serializer";
import { getDemoUserId } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    expenseId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { expenseId } = await context.params;
    const body = await request.json();
    const parsedBody = expenseApiSchema.parse(body);

    const userId = await getDemoUserId();

    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId,
      },
    });

    if (!existingExpense) {
      return NextResponse.json(
        {
          message: "Expense record not found.",
        },
        {
          status: 404,
        },
      );
    }

    const updatedExpense = await prisma.expense.update({
      where: {
        id: expenseId,
      },
      data: {
        title: parsedBody.title,
        category: parsedBody.category,
        type: parsedBody.type,
        amount: parsedBody.amount,
        spentAt: new Date(parsedBody.spentAt),
        notes: parsedBody.notes?.trim() ? parsedBody.notes.trim() : null,
      },
    });

    return NextResponse.json({
      data: serializeExpense(updatedExpense),
    });
  } catch (error) {
    console.error("PATCH /api/expenses/[expenseId] error:", error);

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
        message: "Failed to update expense record.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { expenseId } = await context.params;
    const userId = await getDemoUserId();

    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId,
      },
    });

    if (!existingExpense) {
      return NextResponse.json(
        {
          message: "Expense record not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });

    return NextResponse.json({
      message: "Expense record deleted successfully.",
      deletedId: expenseId,
    });
  } catch (error) {
    console.error("DELETE /api/expenses/[expenseId] error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete expense record.",
      },
      {
        status: 500,
      },
    );
  }
}
