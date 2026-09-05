import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { calculateInvestmentHolding } from "@/features/investments/lib/investment-holding-engine";

import {
  serializeInvestmentAssetWithTransactions,
  serializeInvestmentTransaction,
} from "@/features/investments/lib/investment-v2-serializer";

import { createInvestmentTransactionV2Schema } from "@/features/investments/schemas/investment-v2-api.schema";

import { getAuthenticatedUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    assetId: string;
    transactionId: string;
  }>;
};

function getChainValidationMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "The resulting investment transaction history would be invalid.";
}

// =====================================================
// PATCH TRANSACTION
// =====================================================

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const { assetId, transactionId } = await context.params;

    // =================================================
    // 1. VALIDATE BODY
    // =================================================

    const body: unknown = await request.json();

    const parsedBody = createInvestmentTransactionV2Schema.parse(body);

    const normalizedCurrencyCode = parsedBody.currencyCode.trim().toUpperCase();

    // =================================================
    // 2. DATABASE TRANSACTION
    // =================================================

    const result = await prisma.$transaction(
      async (database) => {
        // =============================================
        // LOAD ASSET + FULL TRANSACTION CHAIN
        // =============================================

        const asset = await database.investmentAsset.findFirst({
          where: {
            id: assetId,

            userId,
          },

          include: {
            transactions: true,

            events: true,
          },
        });

        if (!asset) {
          return {
            status: "ASSET_NOT_FOUND",
          } as const;
        }

        const targetTransaction = asset.transactions.find(
          (transaction) => transaction.id === transactionId,
        );

        if (!targetTransaction) {
          return {
            status: "TRANSACTION_NOT_FOUND",
          } as const;
        }

        // =============================================
        // 3. SERIALIZE CURRENT CHAIN
        // =============================================

        const serializedAsset = serializeInvestmentAssetWithTransactions(asset);

        /*
         * Current holding digunakan untuk menentukan
         * apakah asset adalah:
         *
         * QUANTITY
         * → BUY / SELL
         *
         * PRINCIPAL
         * → OPEN / CLOSE
         */
        const currentHolding = calculateInvestmentHolding(serializedAsset);

        // =============================================
        // 4. VALIDATE TRANSACTION TYPE AGAINST ASSET
        // =============================================

        if (
          currentHolding.positionKind === "QUANTITY" &&
          parsedBody.type !== "BUY" &&
          parsedBody.type !== "SELL"
        ) {
          return {
            status: "INVALID_TYPE",

            message:
              "Quantity-based investments only support BUY and SELL transactions.",
          } as const;
        }

        if (
          currentHolding.positionKind === "PRINCIPAL" &&
          parsedBody.type !== "OPEN" &&
          parsedBody.type !== "CLOSE"
        ) {
          return {
            status: "INVALID_TYPE",

            message:
              "Principal-based investments only support OPEN and CLOSE transactions.",
          } as const;
        }

        // =============================================
        // 5. CREATE CANDIDATE TRANSACTION CHAIN
        // =============================================

        const candidateTransactions = serializedAsset.transactions.map(
          (transaction) => {
            if (transaction.id !== transactionId) {
              return transaction;
            }

            return {
              ...transaction,

              type: parsedBody.type,

              quantity: parsedBody.quantity ?? null,

              grossAmount: parsedBody.grossAmount,

              feeAmount: parsedBody.feeAmount,

              currencyCode: normalizedCurrencyCode,

              transactedAt: parsedBody.transactedAt,

              notes: parsedBody.notes ?? null,
            };
          },
        );

        const candidateAsset = {
          ...serializedAsset,

          transactions: candidateTransactions,
        };

        // =============================================
        // 6. SIMULATE FULL TRANSACTION HISTORY
        // =============================================

        try {
          calculateInvestmentHolding(candidateAsset);
        } catch (error) {
          return {
            status: "INVALID_CHAIN",

            message: getChainValidationMessage(error),
          } as const;
        }

        // =============================================
        // 7. UPDATE ONLY AFTER CHAIN IS VALID
        // =============================================

        const updatedTransaction = await database.investmentTransaction.update({
          where: {
            id: transactionId,
          },

          data: {
            type: parsedBody.type,

            quantity: parsedBody.quantity ?? null,

            grossAmount: parsedBody.grossAmount,

            feeAmount: parsedBody.feeAmount,

            currencyCode: normalizedCurrencyCode,

            transactedAt: new Date(parsedBody.transactedAt),

            notes: parsedBody.notes ?? null,
          },
        });

        return {
          status: "SUCCESS",

          transaction: serializeInvestmentTransaction(updatedTransaction),
        } as const;
      },

      {
        /*
         * Penting untuk operasi chain validation.
         *
         * Kita tidak ingin dua edit transaction
         * asset yang sama lolos berdasarkan snapshot
         * lama secara bersamaan.
         */
        isolationLevel: "Serializable",
      },
    );

    // =================================================
    // 8. HTTP RESPONSE
    // =================================================

    if (result.status === "ASSET_NOT_FOUND") {
      return NextResponse.json(
        {
          message: "Investment asset not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (result.status === "TRANSACTION_NOT_FOUND") {
      return NextResponse.json(
        {
          message: "Investment transaction not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (result.status === "INVALID_TYPE") {
      return NextResponse.json(
        {
          message: result.message,
        },
        {
          status: 400,
        },
      );
    }

    if (result.status === "INVALID_CHAIN") {
      return NextResponse.json(
        {
          message:
            "This transaction cannot be updated because it would make the investment transaction history invalid.",

          data: {
            reason: result.message,
          },
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({
      data: result.transaction,
    });
  } catch (error) {
    console.error(
      "PATCH /api/investments/v2/[assetId]/transactions/[transactionId] error:",
      error,
    );

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid investment transaction payload.",

          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to update investment transaction.",
      },
      {
        status: 500,
      },
    );
  }
}

// =====================================================
// DELETE TRANSACTION
// =====================================================

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await getAuthenticatedUserId();

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const { assetId, transactionId } = await context.params;

    // =================================================
    // 1. DATABASE TRANSACTION
    // =================================================

    const result = await prisma.$transaction(
      async (database) => {
        // =============================================
        // LOAD ASSET + FULL TRANSACTION CHAIN
        // =============================================

        const asset = await database.investmentAsset.findFirst({
          where: {
            id: assetId,

            userId,
          },

          include: {
            transactions: true,

            events: true,
          },
        });

        if (!asset) {
          return {
            status: "ASSET_NOT_FOUND",
          } as const;
        }

        const targetTransaction = asset.transactions.find(
          (transaction) => transaction.id === transactionId,
        );

        if (!targetTransaction) {
          return {
            status: "TRANSACTION_NOT_FOUND",
          } as const;
        }

        // =============================================
        // 2. PREVENT ASSET WITHOUT TRANSACTIONS
        // =============================================

        if (asset.transactions.length <= 1) {
          return {
            status: "LAST_TRANSACTION",
          } as const;
        }

        // =============================================
        // 3. BUILD CANDIDATE CHAIN WITHOUT TARGET
        // =============================================

        const serializedAsset = serializeInvestmentAssetWithTransactions(asset);

        const candidateTransactions = serializedAsset.transactions.filter(
          (transaction) => transaction.id !== transactionId,
        );

        const candidateAsset = {
          ...serializedAsset,

          transactions: candidateTransactions,
        };

        // =============================================
        // 4. SIMULATE FULL TRANSACTION HISTORY
        // =============================================

        try {
          calculateInvestmentHolding(candidateAsset);
        } catch (error) {
          return {
            status: "INVALID_CHAIN",

            message: getChainValidationMessage(error),
          } as const;
        }

        // =============================================
        // 5. DELETE ONLY AFTER CHAIN IS VALID
        // =============================================

        await database.investmentTransaction.delete({
          where: {
            id: transactionId,
          },
        });

        return {
          status: "SUCCESS",

          transactionId,
        } as const;
      },

      {
        isolationLevel: "Serializable",
      },
    );

    // =================================================
    // 6. HTTP RESPONSE
    // =================================================

    if (result.status === "ASSET_NOT_FOUND") {
      return NextResponse.json(
        {
          message: "Investment asset not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (result.status === "TRANSACTION_NOT_FOUND") {
      return NextResponse.json(
        {
          message: "Investment transaction not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (result.status === "LAST_TRANSACTION") {
      return NextResponse.json(
        {
          message:
            "The only transaction of an investment asset cannot be deleted. Delete the investment asset instead.",
        },
        {
          status: 400,
        },
      );
    }

    if (result.status === "INVALID_CHAIN") {
      return NextResponse.json(
        {
          message:
            "This transaction cannot be deleted because it would make the investment transaction history invalid.",

          data: {
            reason: result.message,
          },
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({
      data: {
        id: result.transactionId,
      },
    });
  } catch (error) {
    console.error(
      "DELETE /api/investments/v2/[assetId]/transactions/[transactionId] error:",
      error,
    );

    return NextResponse.json(
      {
        message: "Failed to delete investment transaction.",
      },
      {
        status: 500,
      },
    );
  }
}
