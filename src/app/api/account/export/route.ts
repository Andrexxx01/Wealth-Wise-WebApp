import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
};

export async function GET() {
  try {
    const auth = await getAuthenticatedUserId();
    if (!auth.success) {
      for (const [key, value] of Object.entries(privateHeaders)) auth.response.headers.set(key, value);
      return auth.response;
    }

    // Read every collection from the same database snapshot.
    // Select financial fields explicitly, without account credentials or tokens.
    const data = await prisma.$transaction(async (tx) => {
      const incomes = await tx.income.findMany({
        where: { userId: auth.userId },
        orderBy: { id: "asc" },
        select: {
          id: true,
          title: true,
          category: true,
          amount: true,
          currency: true,
          receivedAt: true,
          frequency: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const expenses = await tx.expense.findMany({
        where: { userId: auth.userId },
        orderBy: { id: "asc" },
        select: {
          id: true,
          title: true,
          category: true,
          type: true,
          amount: true,
          currency: true,
          spentAt: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const investmentAssets = await tx.investmentAsset.findMany({
        where: { userId: auth.userId },
        orderBy: { id: "asc" },
        select: {
          id: true,
          name: true,
          category: true,
          instrumentType: true,
          valuationType: true,
          symbol: true,
          providerSymbol: true,
          exchange: true,
          isin: true,
          issuer: true,
          underlyingIndex: true,
          unit: true,
          pricingUnit: true,
          marketCurrencyCode: true,
          manualPrice: true,
          manualPriceUpdatedAt: true,
          currentNav: true,
          navUpdatedAt: true,
          annualInterestRate: true,
          couponRate: true,
          faceValue: true,
          maturityDate: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const investmentTransactions = await tx.investmentTransaction.findMany({
        where: { userId: auth.userId },
        orderBy: { id: "asc" },
        select: {
          id: true,
          assetId: true,
          type: true,
          quantity: true,
          grossAmount: true,
          feeAmount: true,
          currencyCode: true,
          transactedAt: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const investmentEvents = await tx.investmentEvent.findMany({
        where: { userId: auth.userId },
        orderBy: { id: "asc" },
        select: {
          id: true,
          assetId: true,
          type: true,
          grossAmount: true,
          feeAmount: true,
          taxAmount: true,
          currencyCode: true,
          occurredAt: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const loans = await tx.loan.findMany({
        where: { userId: auth.userId },
        orderBy: { id: "asc" },
        select: {
          id: true,
          title: true,
          lenderName: true,
          category: true,
          currency: true,
          principalAmount: true,
          remainingBalance: true,
          monthlyPayment: true,
          interestRate: true,
          dueDate: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const budgets = await tx.budget.findMany({
        where: { userId: auth.userId }, orderBy: { id: "asc" },
        select: { id: true, month: true, category: true, currency: true, amount: true, createdAt: true, updatedAt: true },
      });
      return { incomes, expenses, investmentAssets, investmentTransactions, investmentEvents, loans, budgets };
    }, { isolationLevel: "RepeatableRead", timeout: 30000 });

    const exportedAt = new Date().toISOString();
    const payload = {
      application: "WealthWise",
      schemaVersion: 1,
      exportedAt,
      scope: "All recorded financial data for the signed-in account",
      notes: [
        "Amounts and quantities are decimal strings in their original currencies and units.",
        "Dates use ISO 8601. Live market quotes and calculated portfolio valuations are not included.",
        "Investment transactions and events reference investmentAssets by assetId.",
        "This is a data export. Import and automatic restore are not currently supported.",
      ],
      counts: {
        incomes: data.incomes.length,
        expenses: data.expenses.length,
        investmentAssets: data.investmentAssets.length,
        investmentTransactions: data.investmentTransactions.length,
        investmentEvents: data.investmentEvents.length,
        loans: data.loans.length,
        budgets: data.budgets.length,
      },
      data,
    };
    // Prisma Decimal.toJSON preserves decimal precision; do not convert amounts to Number.
    return new Response(JSON.stringify(payload, null, 2), {
      headers: {
        ...privateHeaders,
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="wealthwise-financial-data-${exportedAt.slice(0, 10)}.json"`,
      },
    });
  } catch {
    return NextResponse.json({ message: "Unable to export your data. Please try again." }, {
      status: 500, headers: privateHeaders,
    });
  }
}
