"use client";

import { useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { Input } from "@/components/ui/input";

import type { CreateInvestmentAssetV2FormValues } from "@/types/investment-v2-form";
import type {
  StockResolvedInstrument,
  StockSearchResultItem,
} from "@/types/stock-search";

type StockSearchFieldProps = {
  setValue: UseFormSetValue<CreateInvestmentAssetV2FormValues>;
  error?: string;
};

const SEARCH_DEBOUNCE_MS = 300;

export default function StockSearchField({
  setValue,
  error,
}: StockSearchFieldProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockSearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [resolvingSymbol, setResolvingSymbol] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      requestIdRef.current += 1;
    };
  }, []);

  async function runSearch(searchQuery: string, requestId: number) {
    try {
      const response = await fetch(
        `/api/market-data/stocks/search?q=${encodeURIComponent(searchQuery)}`,
      );

      const payload: unknown = await response.json();

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (!response.ok) {
        setResults([]);
        setMessage("Stock search is temporarily unavailable.");
        return;
      }

      if (
        typeof payload !== "object" ||
        payload === null ||
        !("data" in payload) ||
        !Array.isArray(payload.data)
      ) {
        setResults([]);
        setMessage("Stock search returned an unexpected response.");
        return;
      }

      const nextResults = payload.data as StockSearchResultItem[];

      setResults(nextResults);
      setMessage(
        nextResults.length === 0
          ? "No matching listed stocks found. Try the company name or ticker."
          : null,
      );
    } catch (searchError) {
      console.error("Failed to search stocks:", searchError);

      if (requestId === requestIdRef.current) {
        setResults([]);
        setMessage("Stock search is temporarily unavailable.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsSearching(false);
      }
    }
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setMessage(null);

    setValue("name", "", { shouldDirty: true });
    setValue("symbol", "", { shouldDirty: true });
    setValue("providerSymbol", "", { shouldDirty: true });
    setValue("exchange", "", { shouldDirty: true });
    setValue("marketCurrencyCode", "", { shouldDirty: true });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    requestIdRef.current += 1;

    const requestId = requestIdRef.current;
    const trimmedQuery = value.trim();

    if (trimmedQuery.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    debounceTimerRef.current = setTimeout(() => {
      void runSearch(trimmedQuery, requestId);
    }, SEARCH_DEBOUNCE_MS);
  }

  async function handleSelectStock(result: StockSearchResultItem) {
    try {
      setResolvingSymbol(result.providerSymbol);
      setMessage(null);

      const response = await fetch(
        `/api/market-data/stocks/resolve?symbol=${encodeURIComponent(
          result.providerSymbol,
        )}`,
      );

      const payload: unknown = await response.json();

      if (
        !response.ok ||
        typeof payload !== "object" ||
        payload === null ||
        !("data" in payload) ||
        typeof payload.data !== "object" ||
        payload.data === null
      ) {
        setMessage("Unable to load market details for this stock.");
        return;
      }

      const stock = payload.data as StockResolvedInstrument;

      setValue("name", stock.name, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("symbol", stock.symbol, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("providerSymbol", stock.providerSymbol, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("exchange", stock.exchange, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("marketCurrencyCode", stock.currency, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("currencyCode", stock.currency, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setQuery(`${stock.name} (${stock.symbol})`);
      setResults([]);
      setMessage(
        `${stock.symbol} · ${stock.exchange} · ${stock.currency}`,
      );
    } catch (resolveError) {
      console.error("Failed to resolve stock:", resolveError);
      setMessage("Unable to load market details for this stock.");
    } finally {
      setResolvingSymbol(null);
    }
  }

  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-sm font-semibold text-slate-900">
        Search Stock
      </label>

      <Input
        value={query}
        onChange={(event) => handleQueryChange(event.target.value)}
        placeholder="Search Apple, Bank Central Asia, AAPL, BBCA..."
        autoComplete="off"
        className="h-12 rounded-2xl border-slate-200 shadow-none"
      />

      <p className="text-xs leading-5 text-slate-500">
        Search by company name or ticker. Exchange suffixes such as .JK are
        handled automatically.
      </p>

      {isSearching ? (
        <p className="text-sm text-slate-500">Searching listed stocks...</p>
      ) : null}

      {results.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {results.map((result) => {
            const isResolving = resolvingSymbol === result.providerSymbol;

            return (
              <button
                key={`${result.providerSymbol}-${result.exchangeCode ?? ""}`}
                type="button"
                disabled={resolvingSymbol !== null}
                onClick={() => void handleSelectStock(result)}
                className="flex w-full items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {result.name}
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    {result.symbol} · {result.exchange}
                  </span>
                </span>

                <span className="shrink-0 text-xs font-semibold text-slate-500">
                  {isResolving ? "Loading..." : "Select"}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
