import { NextResponse } from "next/server";

import { getCryptoSpotPrice } from "@/features/market-data/server/crypto-market-provider";
import { getStockMarketPrice } from "@/features/market-data/server/stock-market-provider";
import { getForexMarketPrice } from "@/features/market-data/server/forex-market-provider";
import { getUsdFxRates } from "@/features/market-data/server/fx-rate-provider";

import { calculateInvestmentHolding } from "@/features/investments/lib/investment-holding-engine";
import { serializeInvestmentAssetWithTransactions } from "@/features/investments/lib/investment-v2-serializer";
import { calculateInvestmentValuation } from "@/features/investments/lib/investment-valuation-engine";

import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

import type { MarketPriceItem } from "@/types/market-price";
import type { UserCurrency } from "@/types/user-subscription";
import { calculateInvestmentPortfolioSummary } from "@/features/investments/lib/investment-portfolio-summary";
import { calculateInvestmentEventSummary } from "@/features/investments/lib/investment-event-engine";
import { calculateDepositAccrual } from "@/features/investments/lib/investment-deposit-accrual-engine";

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

    const eventSummaries = serializedAssets.map((asset) =>
      calculateInvestmentEventSummary(asset.events),
    );

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
    // 5. CARI LISTED SECURITY YANG MEMBUTUHKAN MARKET PRICE
    // =====================================================

    const stockSymbols = [
      ...new Set(
        holdings
          .filter(
            (holding) =>
              holding.valuationType === "MARKET_PRICE" &&
              (
                (holding.category === "STOCK" &&
                  holding.instrumentType === "COMMON_STOCK") ||
                (holding.category === "INDEX" &&
                  holding.instrumentType === "ETF")
              ) &&
              (holding.providerSymbol !== null || holding.symbol !== null),
          )
          .map((holding) =>
            (holding.providerSymbol ?? holding.symbol)!.trim().toUpperCase(),
          )
          .filter(Boolean),
      ),
    ];

    // =====================================================
    // 6. CARI FOREX PAIR YANG MEMBUTUHKAN FX RATE
    // =====================================================

    const forexSymbols = [
      ...new Set(
        holdings
          .filter(
            (holding) =>
              holding.category === "FOREX" &&
              holding.instrumentType === "FOREIGN_CURRENCY" &&
              holding.valuationType === "FX_RATE" &&
              holding.providerSymbol !== null,
          )
          .map((holding) => holding.providerSymbol!.trim().toUpperCase())
          .filter(Boolean),
      ),
    ];

    // =====================================================
    // 7. AMBIL MARKET PRICE + FOREX RATE
    // =====================================================

    const [
      cryptoMarketPriceEntries,
      stockMarketPriceEntries,
      forexMarketPriceEntries,
    ] = await Promise.all([
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

      Promise.all(
        stockSymbols.map(
          async (
            symbol,
          ): Promise<readonly [string, MarketPriceItem | null]> => {
            const marketPrice = await getStockMarketPrice(symbol);

            return [symbol, marketPrice] as const;
          },
        ),
      ),

      Promise.all(
        forexSymbols.map(
          async (
            symbol,
          ): Promise<readonly [string, MarketPriceItem | null]> => {
            const marketPrice = await getForexMarketPrice(symbol);

            return [symbol, marketPrice] as const;
          },
        ),
      ),
    ]);

    const cryptoMarketPrices = new Map<string, MarketPriceItem | null>(
      cryptoMarketPriceEntries,
    );

    const stockMarketPrices = new Map<string, MarketPriceItem | null>(
      stockMarketPriceEntries,
    );

    const forexMarketPrices = new Map<string, MarketPriceItem | null>(
      forexMarketPriceEntries,
    );

    // =====================================================
    // 8. KUMPULKAN CURRENCY YANG DIBUTUHKAN
    // =====================================================
    //
    // FX table dibuat dinamis dari currency yang benar-benar
    // dipakai portfolio:
    //
    // - transaction currency
    // - manual valuation currency
    // - investment-event income currency
    // - current market-price currency
    //
    // USD + IDR selalu diminta untuk menjaga compatibility
    // dengan display currency WealthWise saat ini.
    // =====================================================

    const requiredCurrencies = new Set<string>([
      "USD",
      "IDR",
      displayCurrency,
    ]);

    for (const holding of holdings) {
      if (holding.transactionCurrencyCode) {
        requiredCurrencies.add(holding.transactionCurrencyCode);
      }

      if (holding.marketCurrencyCode) {
        requiredCurrencies.add(holding.marketCurrencyCode);
      }
    }

    for (const eventSummary of eventSummaries) {
      if (eventSummary.incomeCurrencyCode) {
        requiredCurrencies.add(eventSummary.incomeCurrencyCode);
      }
    }

    for (const marketPrice of cryptoMarketPrices.values()) {
      if (marketPrice?.currency) {
        requiredCurrencies.add(marketPrice.currency);
      }
    }

    for (const marketPrice of stockMarketPrices.values()) {
      if (marketPrice?.currency) {
        requiredCurrencies.add(marketPrice.currency);
      }
    }

    for (const marketPrice of forexMarketPrices.values()) {
      if (marketPrice?.currency) {
        requiredCurrencies.add(marketPrice.currency);
      }
    }

    const fxRateTable = await getUsdFxRates([...requiredCurrencies]);

    const usdToIdrRate = fxRateTable.rates.IDR;

    if (!Number.isFinite(usdToIdrRate) || usdToIdrRate <= 0) {
      throw new Error("USD to IDR exchange rate is unavailable.");
    }

    const marketPriceAsOf = new Date().toISOString();

    const depositAccrualSummaries = serializedAssets.map((asset) => {
      if (
        asset.instrumentType !== "DEPOSIT" ||
        asset.valuationType !== "ACCRUAL"
      ) {
        return null;
      }

      return calculateDepositAccrual({
        asset,

        asOf: marketPriceAsOf,
      });
    });

    // =====================================================
    // 9. VALUATION
    // =====================================================

    const valuations = holdings.map((holding, index) => {
      const symbol = holding.symbol?.trim().toUpperCase() ?? null;
      const providerSymbol =
        holding.providerSymbol?.trim().toUpperCase() ?? symbol;

      let marketPrice: MarketPriceItem | null = null;

      if (holding.category === "CRYPTO" && symbol !== null) {
        marketPrice = cryptoMarketPrices.get(symbol) ?? null;
      } else if (
        holding.valuationType === "MARKET_PRICE" &&
        (
          (holding.category === "STOCK" &&
            holding.instrumentType === "COMMON_STOCK") ||
          (holding.category === "INDEX" && holding.instrumentType === "ETF")
        ) &&
        providerSymbol !== null
      ) {
        marketPrice = stockMarketPrices.get(providerSymbol) ?? null;
      } else if (
        holding.category === "FOREX" &&
        holding.instrumentType === "FOREIGN_CURRENCY" &&
        holding.valuationType === "FX_RATE" &&
        providerSymbol !== null
      ) {
        marketPrice = forexMarketPrices.get(providerSymbol) ?? null;
      }

      return calculateInvestmentValuation({
        holding,

        eventSummary: eventSummaries[index],

        depositAccrualSummary: depositAccrualSummaries[index],

        marketPrice,

        displayCurrency,

        fxRates: fxRateTable.rates,

        marketPriceAsOf,
      });
    });

    const summary = calculateInvestmentPortfolioSummary({
      valuations,

      displayCurrency,

      fxRates: fxRateTable.rates,
    });

    // =====================================================
    // 10. RESPONSE
    // =====================================================

    return NextResponse.json({
      data: valuations,

      summary,

      meta: {
        displayCurrency,

        exchangeRate: {
          base: "USD",
          quote: "IDR",
          rate: usdToIdrRate,
        },

        fxRates: {
          base: fxRateTable.base,
          rates: fxRateTable.rates,
          asOf: fxRateTable.asOf,
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
