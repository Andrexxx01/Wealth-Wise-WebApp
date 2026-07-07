import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const DEMO_USER_EMAIL = "demo@wealthwise.local";

const createIncomeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  receivedAt: z.string().min(1, "Received date is required"),
  frequency: z.string().min(1, "Frequency is required"),
  notes: z.string().optional().nullable(),
});

async function getDemoUserId() {
  const user = await prisma.user.upsert({
    where: {
      email: DEMO_USER_EMAIL,
    },
    update: {},
    create: {
      email: DEMO_USER_EMAIL,
      name: "Demo User",
      passwordHash: "demo-password-hash",
    },
  });

  return user.id;
}

function serializeIncome(income: {
  id: string;
  title: string;
  category: string;
  amount: unknown;
  receivedAt: Date;
  frequency: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: income.id,
    title: income.title,
    category: income.category,
    amount: Number(income.amount),
    receivedAt: income.receivedAt.toISOString().slice(0, 10),
    frequency: income.frequency,
    notes: income.notes ?? "",
    createdAt: income.createdAt.toISOString(),
    updatedAt: income.updatedAt.toISOString(),
  };
}

export async function GET() {
  try {
    const userId = await getDemoUserId();

    const incomes = await prisma.income.findMany({
      where: {
        userId,
      },
      orderBy: {
        receivedAt: "desc",
      },
    });

    return NextResponse.json({
      data: incomes.map(serializeIncome),
    });
  } catch (error) {
    console.error("GET /api/income error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch income records.",
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
    const parsedBody = createIncomeSchema.parse(body);

    const userId = await getDemoUserId();

    const income = await prisma.income.create({
      data: {
        userId,
        title: parsedBody.title,
        category: parsedBody.category,
        amount: parsedBody.amount,
        receivedAt: new Date(parsedBody.receivedAt),
        frequency: parsedBody.frequency,
        notes: parsedBody.notes?.trim() ? parsedBody.notes.trim() : null,
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

    if (error instanceof z.ZodError) {
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
