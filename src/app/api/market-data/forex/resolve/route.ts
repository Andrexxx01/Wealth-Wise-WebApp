import { NextRequest, NextResponse } from "next/server";

import { resolveForexInstrument } from "@/features/market-data/server/forex-market-provider";
import { getAuthenticatedUserId } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authResult = await getAuthenticatedUserId();

  if (!authResult.success) {
    return authResult.response;
  }

  const providerSymbol =
    request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase() ?? "";

  if (!providerSymbol) {
    return NextResponse.json(
      { message: "Forex provider symbol is required." },
      { status: 400 },
    );
  }

  const data = await resolveForexInstrument(providerSymbol);

  if (!data) {
    return NextResponse.json(
      { message: "Unable to resolve forex market metadata." },
      { status: 404 },
    );
  }

  return NextResponse.json({ data });
}
