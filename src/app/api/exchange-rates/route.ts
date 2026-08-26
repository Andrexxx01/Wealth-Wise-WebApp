import { NextResponse } from "next/server";

import { getUsdToIdrRate } from "@/features/market-data/server/fx-rate-provider";

export const runtime = "nodejs";

export async function GET() {
  try {
    const exchangeRate = await getUsdToIdrRate();

    return NextResponse.json({
      data: exchangeRate,
    });
  } catch (error) {
    console.error("GET /api/exchange-rates error:", error);

    return NextResponse.json(
      {
        message: "Failed to load exchange rate.",
      },
      {
        status: 500,
      },
    );
  }
}
