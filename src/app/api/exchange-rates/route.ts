import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FRANKFURTER_USD_IDR_URL = "https://api.frankfurter.dev/v2/rate/USD/IDR";

export async function GET() {
  try {
    const response = await fetch(FRANKFURTER_USD_IDR_URL, {
      next: {
        revalidate: 60 * 60 * 24,
      },
    });

    if (!response.ok) {
      throw new Error(`Frankfurter API returned status ${response.status}`);
    }

    const data: unknown = await response.json();

    if (
      typeof data !== "object" ||
      data === null ||
      !("rate" in data) ||
      typeof data.rate !== "number"
    ) {
      throw new Error("Invalid exchange rate response.");
    }

    return NextResponse.json({
      data: {
        base: "USD",
        quote: "IDR",
        rate: data.rate,
      },
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
