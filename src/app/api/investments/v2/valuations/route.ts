import { NextResponse } from "next/server";

import { getCryptoSpotPrice } from "@/features/market-data/server/crypto-market-provider";
import { getUsdToIdrRate } from "@/features/market-data/server/fx-rate-provider";

import { calculateInvestmentHolding } from "@/features/investments/lib/investment-holding-engine";
import { serializeInvestmentAssetWithTransactions } from "@/features/investments/lib/investment-v2-serializer";
import { calculateInvestmentValuation } from "@/features/investments/lib/investment-valuation-engine";

import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

import type { MarketPriceItem } from "@/types/market-price";
import type { UserCurrency } from "@/types/user-subscription";
import { calculateInvestmentPortfolioSummary } from "@/features/investments/lib/investment-portfolio-summary";

export const runtime = "nodejs";

function normalizeDisplayCurrency(currency: string): UserCurrency {
  if (currency === "IDR") {
    return "IDR";
  }

  return "USD";
}

export async function GET() {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    // =====================================================
    // 1. AMBIL DISPLAY CURRENCY USER
    // =====================================================

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        currency: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    const displayCurrency = normalizeDisplayCurrency(user.currency);

    // =====================================================
    // 2. AMBIL INVESTMENT ASSETS + TRANSACTIONS
    // =====================================================

    const investmentAssets = await prisma.investmentAsset.findMany({
      where: {
        userId,
      },

      include: {
        transactions: true,
        events: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    // =====================================================
    // 3. SERIALIZE + HITUNG HOLDINGS
    // =====================================================

    const serializedAssets = investmentAssets.map(
      serializeInvestmentAssetWithTransactions,
    );

    const holdings = serializedAssets.map(calculateInvestmentHolding);

    // =====================================================
    // 4. CARI CRYPTO SYMBOL YANG MEMBUTUHKAN MARKET PRICE
    // =====================================================

    const cryptoSymbols = [
      ...new Set(
        holdings
          .filter(
            (holding) =>
              holding.category === "CRYPTO" &&
              holding.valuationType === "MARKET_PRICE" &&
              holding.symbol !== null,
          )
          .map((holding) => holding.symbol!.trim().toUpperCase())
          .filter(Boolean),
      ),
    ];

    // =====================================================
    // 5. AMBIL MARKET PRICE + FX RATE
    // =====================================================

    const [exchangeRate, marketPriceEntries] = await Promise.all([
      getUsdToIdrRate(),

      Promise.all(
        cryptoSymbols.map(
          async (
            symbol,
          ): Promise<readonly [string, MarketPriceItem | null]> => {
            const marketPrice = await getCryptoSpotPrice(symbol);

            return [symbol, marketPrice] as const;
          },
        ),
      ),
    ]);

    const marketPrices = new Map<string, MarketPriceItem | null>(
      marketPriceEntries,
    );

    const marketPriceAsOf = new Date().toISOString();

    // =====================================================
    // 6. VALUATION
    // =====================================================

    const valuations = holdings.map((holding) => {
      const symbol = holding.symbol?.trim().toUpperCase() ?? null;

      const marketPrice =
        holding.category === "CRYPTO" && symbol !== null
          ? (marketPrices.get(symbol) ?? null)
          : null;

      return calculateInvestmentValuation({
        holding,

        marketPrice,

        displayCurrency,

        usdToIdrRate: exchangeRate.rate,

        marketPriceAsOf,
      });
    });

    const summary = calculateInvestmentPortfolioSummary({
      valuations,

      displayCurrency,

      usdToIdrRate: exchangeRate.rate,
    });

    // =====================================================
    // 7. RESPONSE
    // =====================================================

    return NextResponse.json({
      data: valuations,

      summary,

      meta: {
        displayCurrency,

        exchangeRate: {
          base: exchangeRate.base,
          quote: exchangeRate.quote,
          rate: exchangeRate.rate,
        },

        marketPriceAsOf,
      },
    });
  } catch (error) {
    console.error("GET /api/investments/v2/valuations error:", error);

    return NextResponse.json(
      {
        message: "Failed to calculate investment valuations.",
      },
      {
        status: 500,
      },
    );
  }
}
