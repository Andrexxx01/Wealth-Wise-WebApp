import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(request: Request, context: { params: Promise<{ budgetId: string }> }) {
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const auth = await getAuthenticatedUserId();
    if (!auth.success) return auth.response;
    if (request.headers.get("origin") !== new URL(request.url).origin) {
      return NextResponse.json({ message: "Invalid request origin." }, { status: 403, headers });
    }
    const { budgetId } = await context.params;
    const result = await prisma.budget.deleteMany({ where: { id: budgetId, userId: auth.userId } });
    if (!result.count) return NextResponse.json({ message: "Budget not found." }, { status: 404, headers });
    return NextResponse.json({ message: "Budget deleted." }, { headers });
  } catch {
    return NextResponse.json({ message: "Unable to delete budget." }, { status: 500, headers });
  }
}
