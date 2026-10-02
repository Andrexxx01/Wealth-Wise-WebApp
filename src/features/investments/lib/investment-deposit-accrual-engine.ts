import type {
  InvestmentAssetWithTransactionsItem,
  InvestmentEventItem,
  InvestmentTransactionItem,
} from "@/types/investment-v2";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const MONEY_EPSILON = 1e-8;

export type DepositAccrualSummary = {
  annualInterestRate: number;

  dayCountBasis: 365;

  valuationStartAt: string | null;

  valuationEndAt: string;
  accrualEndAt: string;

  principalBalanceAtValuation: number;

  grossAccruedInterest: number;

  realizedGrossInterest: number;

  unpaidAccruedInterest: number;

  accruedValue: number;

  realizedInterestExceedsAccrual: boolean;
};

function requireValidDate(value: string, fieldName: string) {
  const timestamp = new Date(value).getTime();

  if (!Number.isFinite(timestamp)) {
    throw new Error(`Invalid ${fieldName}: ${value}.`);
  }

  return timestamp;
}

function sortTransactionsChronologically(
  transactions: InvestmentTransactionItem[],
) {
  return [...transactions].sort((a, b) => {
    const dateDifference =
      requireValidDate(a.transactedAt, "transaction date") -
      requireValidDate(b.transactedAt, "transaction date");

    if (dateDifference !== 0) {
      return dateDifference;
    }

    const createdAtDifference =
      requireValidDate(a.createdAt, "transaction createdAt") -
      requireValidDate(b.createdAt, "transaction createdAt");

    if (createdAtDifference !== 0) {
      return createdAtDifference;
    }

    return a.id.localeCompare(b.id);
  });
}

function calculateElapsedDays(startTimestamp: number, endTimestamp: number) {
  if (endTimestamp <= startTimestamp) {
    return 0;
  }

  return (endTimestamp - startTimestamp) / MILLISECONDS_PER_DAY;
}

function calculateSimpleInterest({
  principal,
  annualInterestRate,
  days,
}: {
  principal: number;

  annualInterestRate: number;

  days: number;
}) {
  if (principal <= MONEY_EPSILON || days <= 0) {
    return 0;
  }

  return principal * (annualInterestRate / 100) * (days / 365);
}

function getRealizedGrossInterest({
  events,
  valuationEndTimestamp,
}: {
  events: InvestmentEventItem[];

  valuationEndTimestamp: number;
}) {
  let total = 0;

  for (const event of events) {
    if (event.type !== "INTEREST") {
      continue;
    }

    const occurredAtTimestamp = requireValidDate(
      event.occurredAt,
      "investment event date",
    );

    /*
     * Future interest events tidak boleh
     * mengurangi accrual pada valuation date
     * yang lebih awal.
     */
    if (occurredAtTimestamp > valuationEndTimestamp) {
      continue;
    }

    if (
      event.grossAmount === null ||
      !Number.isFinite(event.grossAmount) ||
      event.grossAmount <= 0
    ) {
      throw new Error(
        `Interest event ${event.id} requires a positive gross amount.`,
      );
    }

    total += event.grossAmount;
  }

  return total;
}

export function calculateDepositAccrual({
  asset,
  asOf,
}: {
  asset: InvestmentAssetWithTransactionsItem;

  asOf: string;
}): DepositAccrualSummary {
  // =====================================================
  // INSTRUMENT VALIDATION
  // =====================================================

  if (asset.instrumentType !== "DEPOSIT") {
    throw new Error(`Investment asset ${asset.id} is not a deposit.`);
  }

  if (asset.valuationType !== "ACCRUAL") {
    throw new Error(`Deposit asset ${asset.id} must use ACCRUAL valuation.`);
  }

  // =====================================================
  // INTEREST RATE
  // =====================================================

  const annualInterestRate = asset.annualInterestRate;

  if (
    annualInterestRate === null ||
    !Number.isFinite(annualInterestRate) ||
    annualInterestRate < 0
  ) {
    throw new Error(
      `Deposit asset ${asset.id} requires a valid annual interest rate.`,
    );
  }

  // =====================================================
  // VALUATION END
  // =====================================================

  const asOfTimestamp = requireValidDate(asOf, "deposit valuation date");

  /*
   * valuationEndTimestamp menentukan posisi
   * investasi yang berlaku pada tanggal valuation.
   *
   * Transaction sampai asOf tetap harus diproses,
   * termasuk CLOSE setelah maturity.
   */
  const valuationEndTimestamp = asOfTimestamp;

  /*
   * accrualEndTimestamp menentukan sampai kapan
   * bunga boleh terus bertambah.
   *
   * Contractual maturity menghentikan accrual,
   * tetapi tidak menghentikan pemrosesan transaksi.
   */
  let accrualEndTimestamp = asOfTimestamp;

  if (asset.maturityDate !== null) {
    const maturityTimestamp = requireValidDate(
      asset.maturityDate,
      "deposit maturity date",
    );

    accrualEndTimestamp = Math.min(accrualEndTimestamp, maturityTimestamp);
  }

  // =====================================================
  // TRANSACTION TIMELINE
  // =====================================================

  const transactions = sortTransactionsChronologically(asset.transactions);

  let principalBalance = 0;

  let grossAccruedInterest = 0;

  let valuationStartAt: string | null = null;

  let previousTimestamp: number | null = null;

  for (const transaction of transactions) {
    if (transaction.type !== "OPEN" && transaction.type !== "CLOSE") {
      throw new Error(
        `Deposit transaction ${transaction.id} must be OPEN or CLOSE.`,
      );
    }

    if (
      !Number.isFinite(transaction.grossAmount) ||
      transaction.grossAmount < 0
    ) {
      throw new Error(
        `Invalid grossAmount in deposit transaction ${transaction.id}.`,
      );
    }

    const transactionTimestamp = requireValidDate(
      transaction.transactedAt,
      "deposit transaction date",
    );

    /*
     * Transaction setelah valuation end
     * tidak memengaruhi valuation saat ini.
     */
    if (transactionTimestamp > valuationEndTimestamp) {
      break;
    }

    /*
     * Accrue principal yang berlaku
     * SEBELUM transaction berikutnya.
     *
     * Contoh:
     *
     * Jan 1 OPEN 100 juta
     * Mar 1 CLOSE 40 juta
     *
     * Jan 1 -> Mar 1
     * bunga dihitung dari 100 juta.
     */
    if (previousTimestamp !== null && previousTimestamp < accrualEndTimestamp) {
      const accrualSegmentEnd = Math.min(
        transactionTimestamp,
        accrualEndTimestamp,
      );

      const elapsedDays = calculateElapsedDays(
        previousTimestamp,
        accrualSegmentEnd,
      );

      grossAccruedInterest += calculateSimpleInterest({
        principal: principalBalance,

        annualInterestRate,

        days: elapsedDays,
      });
    }

    // ===================================================
    // APPLY TRANSACTION
    // ===================================================

    if (transaction.type === "OPEN") {
      if (valuationStartAt === null) {
        valuationStartAt = transaction.transactedAt;
      }

      principalBalance += transaction.grossAmount;
    }

    if (transaction.type === "CLOSE") {
      if (transaction.grossAmount > principalBalance + MONEY_EPSILON) {
        throw new Error(
          `Deposit transaction ${transaction.id} attempts to close more principal than is currently open.`,
        );
      }

      principalBalance -= transaction.grossAmount;

      if (Math.abs(principalBalance) <= MONEY_EPSILON) {
        principalBalance = 0;
      }
    }

    previousTimestamp = transactionTimestamp;
  }

  // =====================================================
  // FINAL ACCRUAL PERIOD
  // =====================================================
  //
  // Setelah transaction terakhir hingga asOf/maturity.
  // =====================================================

  if (previousTimestamp !== null && previousTimestamp < accrualEndTimestamp) {
    const elapsedDays = calculateElapsedDays(
      previousTimestamp,
      accrualEndTimestamp,
    );

    grossAccruedInterest += calculateSimpleInterest({
      principal: principalBalance,

      annualInterestRate,

      days: elapsedDays,
    });
  }

  // =====================================================
  // REALIZED INTEREST
  // =====================================================

  const realizedGrossInterest = getRealizedGrossInterest({
    events: asset.events,

    valuationEndTimestamp,
  });

  /*
   * Gross accrual adalah bunga teoritis sejak
   * timeline deposit dimulai.
   *
   * INTEREST event adalah bunga yang sudah
   * benar-benar dibayar.
   *
   * Karena itu bunga yang masih melekat pada
   * valuation tidak boleh menghitung kembali
   * realized interest.
   */
  const rawUnpaidAccruedInterest = grossAccruedInterest - realizedGrossInterest;

  const realizedInterestExceedsAccrual =
    rawUnpaidAccruedInterest < -MONEY_EPSILON;

  /*
   * Jangan membuat accrued interest negatif.
   *
   * Jika realized interest ternyata lebih besar
   * dari theoretical accrual, kita catat kondisi
   * tersebut lewat flag di atas.
   *
   * Perbedaannya bisa berasal dari:
   * - metode bank yang berbeda,
   * - rounding,
   * - compounding,
   * - bonus interest,
   * - atau data input yang tidak cocok.
   */
  const unpaidAccruedInterest = Math.max(0, rawUnpaidAccruedInterest);

  // =====================================================
  // ACCRUED VALUE
  // =====================================================

  const accruedValue = principalBalance + unpaidAccruedInterest;

  return {
    annualInterestRate,

    dayCountBasis: 365,

    valuationStartAt,

    valuationEndAt: new Date(valuationEndTimestamp).toISOString(),

    accrualEndAt: new Date(accrualEndTimestamp).toISOString(),

    principalBalanceAtValuation: principalBalance,

    grossAccruedInterest,

    realizedGrossInterest,

    unpaidAccruedInterest,

    accruedValue,

    realizedInterestExceedsAccrual,
  };
}
