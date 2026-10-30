import { NextRequest, NextResponse } from "next/server";

import { searchForexPairs } from "@/features/market-data/server/forex-market-provider";
import { getAuthenticatedUserId } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authResult = await getAuthenticatedUserId();

  if (!authResult.success) {
    return authResult.response;
  }

  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ data: [] });
  }

  if (query.length > 40) {
    return NextResponse.json(
      { message: "Forex search query is too long." },
      { status: 400 },
    );
  }

  const data = await searchForexPairs(query);

  return NextResponse.json({ data });
}
