import { NextRequest, NextResponse } from "next/server";

import { getCryptoSpotPrice } from "@/features/market-data/server/crypto-market-provider";

import type { MarketPriceData } from "@/types/market-price";

export const runtime = "nodejs";

function normalizeSymbols(symbolsParam: string | null) {
  if (!symbolsParam) {
    return [];
  }

  return [
    ...new Set(
      symbolsParam
        .split(",")
        .map((symbol) => symbol.trim().toUpperCase())
        .filter(Boolean),
    ),
  ];
}

export async function GET(request: NextRequest) {
  const symbols = normalizeSymbols(request.nextUrl.searchParams.get("symbols"));

  if (symbols.length === 0) {
    return NextResponse.json(
      {
        message: "At least one market symbol is required.",
      },
      {
        status: 400,
      },
    );
  }

  if (symbols.length > 25) {
    return NextResponse.json(
      {
        message: "A maximum of 25 symbols is allowed.",
      },
      {
        status: 400,
      },
    );
  }

  const priceEntries = await Promise.all(
    symbols.map(async (symbol) => {
      const price = await getCryptoSpotPrice(symbol);

      return [symbol, price] as const;
    }),
  );

  const data: MarketPriceData = {
    prices: Object.fromEntries(priceEntries),

    quoteCurrency: "USD",

    asOf: new Date().toISOString(),
  };

  return NextResponse.json({
    data,
  });
}
