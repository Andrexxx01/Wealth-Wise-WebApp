import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { isBudgetMonth, parseBudgetPayload } from "@/features/budgets/lib/budget-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  try {
    const auth = await getAuthenticatedUserId();
    if (!auth.success) return auth.response;
    const month = new URL(request.url).searchParams.get("month");
    if (!isBudgetMonth(month)) return NextResponse.json({ message: "Choose a valid month." }, { status: 400, headers });
    const budgets = await prisma.budget.findMany({
      where: { userId: auth.userId, month }, orderBy: [{ category: "asc" }, { currency: "asc" }],
      select: { id: true, month: true, category: true, currency: true, amount: true },
    });
    return NextResponse.json({ data: budgets.map((budget) => ({ ...budget, amount: budget.amount.toString() })) }, { headers });
  } catch {
    return NextResponse.json({ message: "Unable to load budgets." }, { status: 500, headers });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await getAuthenticatedUserId();
    if (!auth.success) return auth.response;
    if (request.headers.get("origin") !== new URL(request.url).origin) {
      return NextResponse.json({ message: "Invalid request origin." }, { status: 403, headers });
    }
    const text = await request.text();
    if (text.length > 4096) return NextResponse.json({ message: "Request too large." }, { status: 413, headers });
    let payload;
    try { payload = parseBudgetPayload(JSON.parse(text)); } catch (cause) {
      return NextResponse.json({ message: cause instanceof SyntaxError ? "Invalid JSON." : cause instanceof Error ? cause.message : "Invalid budget." }, { status: 400, headers });
    }
    const budget = await prisma.budget.upsert({
      where: { userId_month_category_currency: {
        userId: auth.userId, month: payload.month, category: payload.category, currency: payload.currency,
      } },
      create: { userId: auth.userId, ...payload }, update: { amount: payload.amount },
      select: { id: true, month: true, category: true, currency: true, amount: true },
    });
    return NextResponse.json({ data: { ...budget, amount: budget.amount.toString() } }, { headers });
  } catch {
    return NextResponse.json({ message: "Unable to save budget. Please try again." }, { status: 500, headers });
  }
}
