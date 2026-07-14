import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { serializeLoan } from "@/features/loans/lib/loan-serializer";
import { loanApiSchema } from "@/features/loans/schemas/loan-api.schema";
import { getDemoUserId } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    loanId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { loanId } = await context.params;
    const body = await request.json();
    const parsedBody = loanApiSchema.parse(body);

    const userId = await getDemoUserId();

    const existingLoan = await prisma.loan.findFirst({
      where: {
        id: loanId,
        userId,
      },
    });

    if (!existingLoan) {
      return NextResponse.json(
        {
          message: "Loan record not found.",
        },
        {
          status: 404,
        },
      );
    }

    const updatedLoan = await prisma.loan.update({
      where: {
        id: loanId,
      },
      data: {
        title: parsedBody.title,
        lenderName: parsedBody.lenderName,
        category: parsedBody.category,
        principalAmount: parsedBody.principalAmount,
        remainingBalance: parsedBody.remainingBalance,
        monthlyPayment: parsedBody.monthlyPayment,
        interestRate:
          parsedBody.interestRate === null ||
          parsedBody.interestRate === undefined
            ? null
            : parsedBody.interestRate,
        dueDate: parsedBody.dueDate ? new Date(parsedBody.dueDate) : null,
        status: parsedBody.status,
      },
    });

    return NextResponse.json({
      data: serializeLoan(updatedLoan),
    });
  } catch (error) {
    console.error("PATCH /api/loans/[loanId] error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid loan payload.",
          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to update loan record.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { loanId } = await context.params;
    const userId = await getDemoUserId();

    const existingLoan = await prisma.loan.findFirst({
      where: {
        id: loanId,
        userId,
      },
    });

    if (!existingLoan) {
      return NextResponse.json(
        {
          message: "Loan record not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.loan.delete({
      where: {
        id: loanId,
      },
    });

    return NextResponse.json({
      message: "Loan record deleted successfully.",
      deletedId: loanId,
    });
  } catch (error) {
    console.error("DELETE /api/loans/[loanId] error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete loan record.",
      },
      {
        status: 500,
      },
    );
  }
}
