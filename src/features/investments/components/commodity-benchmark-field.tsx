"use client";

import type { UseFormSetValue } from "react-hook-form";

import type { CreateInvestmentAssetV2FormValues } from "@/types/investment-v2-form";

type CommodityBenchmarkFieldProps = {
  setValue: UseFormSetValue<CreateInvestmentAssetV2FormValues>;
  error?: string;
};

const COMMODITY_BENCHMARKS = {
  GOLD: {
    name: "Gold",
    symbol: "XAU",
    providerSymbol: "GC=F",
    exchange: "COMEX",
    marketCurrencyCode: "USD",
    unit: "TROY_OUNCE",
    pricingUnit: "TROY_OUNCE",
  },

  SILVER: {
    name: "Silver",
    symbol: "XAG",
    providerSymbol: "SI=F",
    exchange: "COMEX",
    marketCurrencyCode: "USD",
    unit: "TROY_OUNCE",
    pricingUnit: "TROY_OUNCE",
  },
} as const;

type CommodityBenchmarkKey = keyof typeof COMMODITY_BENCHMARKS;

export default function CommodityBenchmarkField({
  setValue,
  error,
}: CommodityBenchmarkFieldProps) {
  function handleChange(value: string) {
    if (!(value in COMMODITY_BENCHMARKS)) {
      return;
    }

    const benchmark =
      COMMODITY_BENCHMARKS[value as CommodityBenchmarkKey];

    setValue("name", benchmark.name, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("symbol", benchmark.symbol, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("providerSymbol", benchmark.providerSymbol, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("exchange", benchmark.exchange, {
      shouldDirty: true,
    });

    setValue("marketCurrencyCode", benchmark.marketCurrencyCode, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("currencyCode", benchmark.marketCurrencyCode, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("unit", benchmark.unit, {
      shouldDirty: true,
    });

    setValue("pricingUnit", benchmark.pricingUnit, {
      shouldDirty: true,
    });

    setValue("valuationType", "MARKET_PRICE", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-sm font-semibold text-slate-900">
        Commodity Market Benchmark
      </label>

      <select
        defaultValue=""
        onChange={(event) => handleChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="" disabled>
          Select Gold or Silver
        </option>

        <option value="GOLD">Gold - COMEX benchmark</option>
        <option value="SILVER">Silver - COMEX benchmark</option>
      </select>

      <p className="text-xs leading-5 text-slate-500">
        Quantity is measured in troy ounces. Market price uses the
        Yahoo Finance COMEX benchmark and is not a dealer-specific
        physical gold or silver buyback price.
      </p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
