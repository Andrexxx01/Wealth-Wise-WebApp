"use client";

import { useState } from "react";

import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import HistoryControls from "@/components/dashboard/history-controls";
import HistoryDateRangeFilter from "@/components/dashboard/history-date-range-filter";
import HistoryFilterSelect from "@/components/dashboard/history-filter-select";
import HistoryPageShell from "@/components/dashboard/history-page-shell";
import HistorySortSelect from "@/components/dashboard/history-sort-select";
import HistorySummaryGrid from "@/components/dashboard/history-summary-grid";
import RecordActionButtons from "@/components/dashboard/record-action-buttons";

import { useCurrentUser } from "@/features/auth/components/current-user-provider";
import { useExchangeRate } from "@/features/currency/hooks/use-exchange-rate";
import { useFinance } from "@/features/finance/components/finance-provider";

import EditInvestmentTransactionV2Dialog from "@/features/investments/components/edit-investment-transaction-v2-dialog";

import { InvestmentV2ApiError } from "@/features/investments/api/investment-v2-api";

import useEditRecordDialog from "@/hooks/use-edit-record-dialog";
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

function getDeleteInvestmentTransactionErrorMessage(error: unknown) {
  if (error instanceof InvestmentV2ApiError) {
    if (
      error.data &&
      typeof error.data === "object" &&
      "reason" in error.data
    ) {
      const reason = (
        error.data as {
          reason?: unknown;
        }
      ).reason;

      if (typeof reason === "string" && reason.trim()) {
        return `${error.message} ${reason}`;
      }
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to delete investment transaction.";
}

export default function InvestmentsHistoryPageClient() {
  // =====================================================
  // EDIT DIALOG
  // =====================================================

  const {
    selectedRecord: selectedTransaction,

    isEditDialogOpen: isEditTransactionOpen,

    openEditDialog: handleOpenEditTransaction,

    handleEditDialogOpenChange: handleEditTransactionOpenChange,
  } = useEditRecordDialog<InvestmentRecentTransactionV2Item>();

  const [transactionActionError, setTransactionActionError] = useState<
    string | null
  >(null);

  // =====================================================
  // USER + FX
  // =====================================================

  const { currentUser } = useCurrentUser();

  const { usdToIdrRate, isExchangeRateLoading, exchangeRateError } =
    useExchangeRate();

  // =====================================================
  // FINANCE V2
  // =====================================================

  const {
    investmentTransactionsV2,

    isInvestmentTransactionsV2Loading,
    investmentTransactionsV2Error,

    deleteInvestmentTransactionV2,
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
     * Total Invested = gross BUY + OPEN.
     *
     * SELL dan CLOSE bukan contribution.
     */
    if (transaction.type === "BUY" || transaction.type === "OPEN") {
      totalVisibleInvested += convertedGrossAmount;
    }

    /*
     * Semua transaction fee dihitung:
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
  // DELETE TRANSACTION
  // =====================================================

  async function handleDeleteTransaction(
    transaction: InvestmentRecentTransactionV2Item,
  ) {
    try {
      setTransactionActionError(null);

      await deleteInvestmentTransactionV2(transaction.assetId, transaction.id);
    } catch (error) {
      console.error("Failed to delete investment transaction:", error);

      setTransactionActionError(
        getDeleteInvestmentTransactionErrorMessage(error),
      );
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
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
            {/* =========================================
                TRANSACTION ACTION ERROR
            ========================================= */}

            {transactionActionError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium leading-6 text-red-700">
                  {transactionActionError}
                </p>
              </div>
            ) : null}

            {/* =========================================
                SUMMARY
            ========================================= */}

            <HistorySummaryGrid
              items={[
                {
                  label: "Total Invested",

                  value: isSummaryReady
                    ? formatCurrency(totalVisibleInvested, displayCurrency)
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
                    ? formatCurrency(totalVisibleFees, displayCurrency)
                    : "—",

                  description:
                    "Transaction fees from the visible investment activity.",
                },
              ]}
            />

            {/* =========================================
                TRANSACTION LIST
            ========================================= */}

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
                  >
                    <RecordActionButtons
                      className="mt-4"
                      onEdit={() => {
                        setTransactionActionError(null);

                        handleOpenEditTransaction(transaction);
                      }}
                      onDelete={() => {
                        void handleDeleteTransaction(transaction);
                      }}
                      deleteConfirmMessage="Are you sure you want to delete this investment transaction? The transaction will only be deleted if the remaining investment history stays valid."
                    />
                  </DashboardListItem>
                );
              },
            )}
          </>
        )}
      </HistoryPageShell>

      {/* =================================================
          EDIT INVESTMENT TRANSACTION V2
      ================================================= */}

      <EditInvestmentTransactionV2Dialog
        open={isEditTransactionOpen}
        onOpenChange={handleEditTransactionOpenChange}
        transaction={selectedTransaction}
      />
    </>
  );
}
