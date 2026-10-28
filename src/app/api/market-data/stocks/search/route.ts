import { NextRequest, NextResponse } from "next/server";

import { searchStocks } from "@/features/market-data/server/stock-market-provider";
import { getAuthenticatedUserId } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authResult = await getAuthenticatedUserId();

  if (!authResult.success) {
    return authResult.response;
  }

  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const instrument =
    request.nextUrl.searchParams.get("instrument")?.trim().toUpperCase() ??
    "STOCK";

  if (query.length < 2) {
    return NextResponse.json({ data: [] });
  }

  if (query.length > 80) {
    return NextResponse.json(
      { message: "Stock search query is too long." },
      { status: 400 },
    );
  }

  const allowedQuoteTypes = instrument === "ETF" ? ["ETF"] : ["EQUITY"];

  const data = await searchStocks(query, allowedQuoteTypes);

  return NextResponse.json({ data });
}
