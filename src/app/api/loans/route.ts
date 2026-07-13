import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { serializeLoan } from "@/features/loans/lib/loan-serializer";
import { loanApiSchema } from "@/features/loans/schemas/loan-api.schema";
import { getDemoUserId } from "@/lib/demo-user";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const userId = await getDemoUserId();

    const loans = await prisma.loan.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      data: loans.map(serializeLoan),
    });
  } catch (error) {
    console.error("GET /api/loans error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch loan records.",
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
    const parsedBody = loanApiSchema.parse(body);

    const userId = await getDemoUserId();

    const loan = await prisma.loan.create({
      data: {
        userId,
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

    return NextResponse.json(
      {
        data: serializeLoan(loan),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/loans error:", error);

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
        message: "Failed to create loan record.",
      },
      {
        status: 500,
      },
    );
  }
}
