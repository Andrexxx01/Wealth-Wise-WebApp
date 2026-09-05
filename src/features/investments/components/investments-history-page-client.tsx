"use client";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryControls from "@/components/dashboard/history-controls";
import HistoryDateRangeFilter from "@/components/dashboard/history-date-range-filter";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySortSelect from "@/components/dashboard/history-sort-select";
import HistorySummaryGrid from "@/components/dashboard/history-summary-grid";

import { useCurrentUser } from "@/features/auth/components/current-user-provider";
import { useExchangeRate } from "@/features/currency/hooks/use-exchange-rate";
import { useFinance } from "@/features/finance/components/finance-provider";

import useHistoryClearAll from "@/hooks/use-history-clear-all";
import useHistoryFilters from "@/hooks/use-history-filters";
import useHistorySearch from "@/hooks/use-history-search";
import useHistorySort from "@/hooks/use-history-sort";

import { convertCurrency } from "@/lib/currency-conversion";

import {
  doesInvestmentTransactionV2PassFilters,
  investmentTransactionV2CategoryFilterOptions,
  investmentTransactionV2InitialFilters,
  investmentTransactionV2TypeFilterOptions,
} from "@/lib/finance-history-filters";

import { doesInvestmentTransactionV2MatchSearch } from "@/lib/finance-history-search";

import { sortInvestmentTransactionV2HistoryItems } from "@/lib/finance-history-sorters";

import { formatInvestmentV2Category } from "@/lib/finance-labels";

import { formatCurrency, formatDate } from "@/lib/formatters";

import {
  historySortOptions,
  type HistorySortValue,
} from "@/lib/history-sort-options";

import type { InvestmentRecentTransactionV2Item } from "@/types/investment-v2";

import type { UserCurrency } from "@/types/user-subscription";

function formatInvestmentTransactionType(
  type: "BUY" | "SELL" | "OPEN" | "CLOSE",
) {
  switch (type) {
    case "BUY":
      return "Buy";

    case "SELL":
      return "Sell";

    case "OPEN":
      return "Open";

    case "CLOSE":
      return "Close";
  }
}

function formatInvestmentTransactionAmount(
  amount: number,
  currencyCode: string,
) {
  if (currencyCode === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",

      currency: "IDR",

      maximumFractionDigits: 0,
    }).format(amount);
  }

  if (currencyCode === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",

      currency: "USD",

      minimumFractionDigits: 2,

      maximumFractionDigits: 2,
    }).format(amount);
  }

  return `${currencyCode} ${amount.toLocaleString()}`;
}

function formatInvestmentTransactionQuantity(quantity: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 18,
  }).format(quantity);
}

function normalizeSupportedCurrency(currencyCode: string): UserCurrency | null {
  const normalizedCurrency = currencyCode.trim().toUpperCase();

  if (normalizedCurrency === "USD" || normalizedCurrency === "IDR") {
    return normalizedCurrency;
  }

  return null;
}

function convertInvestmentHistoryAmount({
  amount,
  currencyCode,
  displayCurrency,
  usdToIdrRate,
}: {
  amount: number;

  currencyCode: string;

  displayCurrency: UserCurrency;

  usdToIdrRate: number | null;
}) {
  const sourceCurrency = normalizeSupportedCurrency(currencyCode);

  if (!sourceCurrency) {
    return null;
  }

  if (sourceCurrency === displayCurrency) {
    return amount;
  }

  if (usdToIdrRate === null || usdToIdrRate <= 0) {
    return null;
  }

  return convertCurrency(amount, sourceCurrency, displayCurrency, usdToIdrRate);
}

export default function InvestmentsHistoryPageClient() {
  const { currentUser } = useCurrentUser();

  const { usdToIdrRate, isExchangeRateLoading, exchangeRateError } =
    useExchangeRate();

  const {
    investmentTransactionsV2,
    isInvestmentTransactionsV2Loading,
    investmentTransactionsV2Error,
  } = useFinance();

  const displayCurrency = currentUser.currency;

  // =====================================================
  // INITIAL DATE SORT
  // =====================================================

  const sortedInvestmentTransactions = sortInvestmentTransactionV2HistoryItems(
    investmentTransactionsV2,
  );

  // =====================================================
  // SEARCH
  // =====================================================

  const {
    searchQuery,
    setSearchQuery,
    resetSearch,

    filteredItems: searchMatchedInvestmentTransactions,

    hasSearchQuery,
  } = useHistorySearch(
    sortedInvestmentTransactions,

    doesInvestmentTransactionV2MatchSearch,
  );

  // =====================================================
  // FILTERS
  // =====================================================

  const {
    filters,
    setFilter,
    resetFilters,

    filteredItems: filteredInvestmentTransactions,

    hasActiveFilter,
  } = useHistoryFilters(
    searchMatchedInvestmentTransactions,

    investmentTransactionV2InitialFilters,

    doesInvestmentTransactionV2PassFilters,
  );

  // =====================================================
  // SORT
  // =====================================================

  const {
    sortValue,
    setSortValue,
    resetSort,
    hasActiveSort,

    sortedItems: visibleInvestmentTransactions,
  } = useHistorySort({
    items: filteredInvestmentTransactions,

    getDateValue: (transaction) => transaction.transactedAt,

    getAmountValue: (transaction) => {
      const convertedAmount = convertInvestmentHistoryAmount({
        amount: transaction.grossAmount,

        currencyCode: transaction.currencyCode,

        displayCurrency,

        usdToIdrRate,
      });

      /*
       * Jika FX belum tersedia,
       * gunakan original amount sebagai
       * fallback sorting.
       *
       * Summary tetap akan menampilkan
       * em dash jika conversion belum siap.
       */
      return convertedAmount ?? transaction.grossAmount;
    },
  });

  // =====================================================
  // CLEAR CONTROLS
  // =====================================================

  const handleClearAll = useHistoryClearAll({
    resetSearch,
    resetFilters,
    resetSort,
  });

  const isFiltering = hasSearchQuery || hasActiveFilter;

  const hasActiveControls = isFiltering || hasActiveSort;

  // =====================================================
  // VISIBLE SUMMARY
  // =====================================================

  let totalVisibleInvested = 0;

  let totalVisibleFees = 0;

  let isVisibleSummaryConversionReady = true;

  for (const transaction of visibleInvestmentTransactions) {
    const convertedGrossAmount = convertInvestmentHistoryAmount({
      amount: transaction.grossAmount,

      currencyCode: transaction.currencyCode,

      displayCurrency,

      usdToIdrRate,
    });

    const convertedFeeAmount = convertInvestmentHistoryAmount({
      amount: transaction.feeAmount,

      currencyCode: transaction.currencyCode,

      displayCurrency,

      usdToIdrRate,
    });

    if (convertedGrossAmount === null || convertedFeeAmount === null) {
      isVisibleSummaryConversionReady = false;

      continue;
    }

    /*
     * Total Invested hanya berarti
     * capital contribution:
     *
     * BUY / OPEN.
     *
     * SELL dan CLOSE bukan investment
     * contribution baru.
     */
    if (transaction.type === "BUY" || transaction.type === "OPEN") {
      totalVisibleInvested += convertedGrossAmount;
    }

    /*
     * Fee ditampilkan terpisah.
     *
     * Ini mencakup fee dari:
     *
     * BUY
     * SELL
     * OPEN
     * CLOSE
     */
    totalVisibleFees += convertedFeeAmount;
  }

  const isSummaryReady =
    !isExchangeRateLoading &&
    !exchangeRateError &&
    isVisibleSummaryConversionReady;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <HistoryPageShell
      eyebrow="Investment History"
      title="All investment transactions"
      description="Review every investment purchase, sale, deposit, and principal transaction recorded in WealthWise."
      backHref="/investments"
      backLabel="Back to Investments"
      isEmpty={
        !isInvestmentTransactionsV2Loading &&
        !investmentTransactionsV2Error &&
        filteredInvestmentTransactions.length === 0
      }
      emptyTitle={
        isFiltering
          ? "No matching investment transactions"
          : "No investment transactions yet"
      }
      emptyDescription={
        isFiltering
          ? "Try changing your search keyword, category, transaction type, or date range."
          : "Your investment transactions will appear here after you record your first investment."
      }
      emptyActionHref="/investments"
      emptyActionLabel="Add Investment"
      toolbar={
        <HistoryControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by asset, symbol, transaction type, category, currency, amount, or date..."
          resultCount={filteredInvestmentTransactions.length}
          totalCount={sortedInvestmentTransactions.length}
          recordLabel="investment transactions"
          hasActiveFilter={hasActiveFilter}
          showClearAllButton={hasActiveControls}
          onResetFilters={resetFilters}
          onClearAll={handleClearAll}
          sortControl={
            <HistorySortSelect
              value={sortValue}
              onChange={(value) => setSortValue(value as HistorySortValue)}
              options={historySortOptions}
            />
          }
        >
          <HistoryFilterSelect
            label="Category"
            value={filters.category}
            onChange={(value) => setFilter("category", value)}
            options={investmentTransactionV2CategoryFilterOptions}
          />

          <HistoryFilterSelect
            label="Type"
            value={filters.type}
            onChange={(value) => setFilter("type", value)}
            options={investmentTransactionV2TypeFilterOptions}
          />

          <HistoryDateRangeFilter
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            onDateFromChange={(value) => setFilter("dateFrom", value)}
            onDateToChange={(value) => setFilter("dateTo", value)}
          />
        </HistoryControls>
      }
    >
      {isInvestmentTransactionsV2Loading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">
            Loading investment transactions...
          </p>
        </div>
      ) : investmentTransactionsV2Error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">
            {investmentTransactionsV2Error}
          </p>
        </div>
      ) : (
        <>
          <HistorySummaryGrid
            items={[
              {
                label: "Total Invested",

                value: isSummaryReady
                  ? formatCurrency(
                      totalVisibleInvested,

                      displayCurrency,
                    )
                  : "—",

                description:
                  "Gross BUY and OPEN contributions from visible transactions.",
              },

              {
                label: "Transactions",

                value: String(visibleInvestmentTransactions.length),

                description: "Investment transactions currently shown.",
              },

              {
                label: "Total Fees",

                value: isSummaryReady
                  ? formatCurrency(
                      totalVisibleFees,

                      displayCurrency,
                    )
                  : "—",

                description:
                  "Transaction fees from the visible investment activity.",
              },
            ]}
          />

          {visibleInvestmentTransactions.map(
            (transaction: InvestmentRecentTransactionV2Item) => {
              const assetTitle = transaction.assetSymbol
                ? `${transaction.assetName} (${transaction.assetSymbol})`
                : transaction.assetName;

              const transactionType = formatInvestmentTransactionType(
                transaction.type,
              );

              const categoryLabel = formatInvestmentV2Category(
                transaction.category,
              );

              const quantityText =
                transaction.quantity !== null
                  ? `${formatInvestmentTransactionQuantity(
                      transaction.quantity,
                    )} ${transaction.assetSymbol ?? "units"}`
                  : null;

              const feeText =
                transaction.feeAmount > 0
                  ? `Fee ${formatInvestmentTransactionAmount(
                      transaction.feeAmount,
                      transaction.currencyCode,
                    )}`
                  : "No fee";

              const metaParts = [
                quantityText,

                feeText,

                formatDate(transaction.transactedAt),
              ].filter((value): value is string => Boolean(value));

              return (
                <DashboardListItem
                  key={transaction.id}
                  title={assetTitle}
                  subtitle={`${transactionType} • ${categoryLabel}`}
                  value={formatInvestmentTransactionAmount(
                    transaction.grossAmount,
                    transaction.currencyCode,
                  )}
                  meta={metaParts.join(" • ")}
                />
              );
            },
          )}
        </>
      )}
    </HistoryPageShell>
  );
}
