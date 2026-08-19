import { NextRequest, NextResponse } from "next/server";
import type { MarketPriceData, MarketPriceItem } from "@/types/market-price";

export const runtime = "nodejs";

const MARKET_PRICE_REVALIDATE_SECONDS = 60 * 60 * 24;

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

async function getCryptoSpotPrice(
  symbol: string,
): Promise<MarketPriceItem | null> {
  try {
    const response = await fetch(
      `https://api.coinbase.com/v2/prices/${symbol}-USD/spot`,
      {
        next: {
          revalidate: MARKET_PRICE_REVALIDATE_SECONDS,
        },
      },
    );

    if (!response.ok) {
      console.error(`Coinbase returned ${response.status} for ${symbol}-USD`);

      return null;
    }

    const result: unknown = await response.json();

    if (
      typeof result !== "object" ||
      result === null ||
      !("data" in result) ||
      typeof result.data !== "object" ||
      result.data === null ||
      !("amount" in result.data) ||
      typeof result.data.amount !== "string"
    ) {
      return null;
    }

    const price = Number(result.data.amount);

    if (!Number.isFinite(price) || price <= 0) {
      return null;
    }

    return {
      symbol,
      price,
      currency: "USD",
      source: "coinbase",
    };
  } catch (error) {
    console.error(`Failed to load market price for ${symbol}:`, error);

    return null;
  }
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
