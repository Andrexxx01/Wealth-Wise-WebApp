"use client";

import { useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { Input } from "@/components/ui/input";

import type { CreateInvestmentAssetV2FormValues } from "@/types/investment-v2-form";
import type {
  ForexResolvedInstrument,
  ForexSearchResultItem,
} from "@/types/forex-search";

const SEARCH_DEBOUNCE_MS = 300;

type ForexSearchFieldProps = {
  setValue: UseFormSetValue<CreateInvestmentAssetV2FormValues>;
  error?: string;
};

export default function ForexSearchField({
  setValue,
  error,
}: ForexSearchFieldProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ForexSearchResultItem[]>([]);
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
        `/api/market-data/forex/search?q=${encodeURIComponent(searchQuery)}`,
      );

      const payload: unknown = await response.json();

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (
        !response.ok ||
        typeof payload !== "object" ||
        payload === null ||
        !("data" in payload) ||
        !Array.isArray(payload.data)
      ) {
        setResults([]);
        setMessage("Forex search is temporarily unavailable.");
        return;
      }

      const nextResults = payload.data as ForexSearchResultItem[];

      setResults(nextResults);
      setMessage(
        nextResults.length === 0
          ? "No matching currency pair found. Try EUR/USD, USD/JPY, or GBP/USD."
          : null,
      );
    } catch (searchError) {
      console.error("Failed to search forex:", searchError);

      if (requestId === requestIdRef.current) {
        setResults([]);
        setMessage("Forex search is temporarily unavailable.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsSearching(false);
      }
    }
  }

  function clearResolvedValues() {
    setValue("name", "", { shouldDirty: true });
    setValue("symbol", "", { shouldDirty: true });
    setValue("providerSymbol", "", { shouldDirty: true });
    setValue("exchange", "", { shouldDirty: true });
    setValue("marketCurrencyCode", "", { shouldDirty: true });
    setValue("unit", "CURRENCY", { shouldDirty: true });
    setValue("pricingUnit", "CURRENCY", { shouldDirty: true });
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setMessage(null);
    clearResolvedValues();

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

  async function handleSelectForex(result: ForexSearchResultItem) {
    try {
      setResolvingSymbol(result.providerSymbol);
      setMessage(null);

      const response = await fetch(
        `/api/market-data/forex/resolve?symbol=${encodeURIComponent(
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
        setMessage("Unable to load market details for this currency pair.");
        return;
      }

      const forex = payload.data as ForexResolvedInstrument;

      setValue("name", forex.name, {
        shouldDirty: true,
        shouldValidate: true,
      });

      // The asset quantity represents units of the base currency.
      setValue("symbol", forex.baseCurrency, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("providerSymbol", forex.providerSymbol, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("exchange", forex.exchange, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("marketCurrencyCode", forex.quoteCurrency, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("currencyCode", forex.quoteCurrency, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("unit", forex.baseCurrency, {
        shouldDirty: true,
      });

      setValue("pricingUnit", forex.baseCurrency, {
        shouldDirty: true,
      });

      setQuery(forex.pair);
      setResults([]);
      setMessage(
        `${forex.pair} · 1 ${forex.baseCurrency} priced in ${forex.quoteCurrency}`,
      );
    } catch (resolveError) {
      console.error("Failed to resolve forex pair:", resolveError);
      setMessage("Unable to load market details for this currency pair.");
    } finally {
      setResolvingSymbol(null);
    }
  }

  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-sm font-semibold text-slate-900">
        Search Currency Pair
      </label>

      <Input
        value={query}
        onChange={(event) => handleQueryChange(event.target.value)}
        placeholder="Search EUR/USD, USD/JPY, GBP/USD..."
        autoComplete="off"
        className="h-12 rounded-2xl border-slate-200 shadow-none"
      />

      <p className="text-xs leading-5 text-slate-500">
        Quantity is the base currency. The purchase amount and market price use
        the quote currency.
      </p>

      {isSearching ? (
        <p className="text-sm text-slate-500">Searching currency pairs...</p>
      ) : null}

      {results.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {results.map((result) => {
            const isResolving = resolvingSymbol === result.providerSymbol;

            return (
              <button
                key={result.providerSymbol}
                type="button"
                disabled={resolvingSymbol !== null}
                onClick={() => void handleSelectForex(result)}
                className="flex w-full items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {result.pair}
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    Hold {result.baseCurrency} · Quote {result.quoteCurrency}
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
