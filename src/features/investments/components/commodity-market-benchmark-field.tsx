"use client";

import { useEffect } from "react";
import type { UseFormSetValue } from "react-hook-form";

import type { CreateInvestmentAssetV2FormValues } from "@/types/investment-v2-form";

type CommodityMarketBenchmarkFieldProps = {
  symbol: string;
  setValue: UseFormSetValue<CreateInvestmentAssetV2FormValues>;
  error?: string;
};

const COMMODITY_BENCHMARKS = {
  WTI_CRUDE_OIL: {
    name: "WTI Crude Oil",
    symbol: "CL",
    providerSymbol: "CL=F",
    exchange: "NYMEX",
    marketCurrencyCode: "USD",
    unit: "BARREL",
    pricingUnit: "BARREL",
    unitLabel: "barrel (bbl)",
  },
  COPPER: {
    name: "Copper",
    symbol: "HG",
    providerSymbol: "HG=F",
    exchange: "COMEX",
    marketCurrencyCode: "USD",
    unit: "KILOGRAM",
    pricingUnit: "POUND",
    unitLabel: "kilogram (kg)",
  },
} as const;

type CommodityBenchmarkKey = keyof typeof COMMODITY_BENCHMARKS;

function getSelectedBenchmarkKey(symbol: string): CommodityBenchmarkKey | "" {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (normalizedSymbol === "CL") return "WTI_CRUDE_OIL";
  if (normalizedSymbol === "HG") return "COPPER";
  return "";
}

export default function CommodityMarketBenchmarkField({
  symbol,
  setValue,
  error,
}: CommodityMarketBenchmarkFieldProps) {
  const selectedBenchmarkKey = getSelectedBenchmarkKey(symbol);
  const selectedBenchmark = selectedBenchmarkKey
    ? COMMODITY_BENCHMARKS[selectedBenchmarkKey]
    : null;

  useEffect(() => {
    if (selectedBenchmarkKey) {
      return;
    }

    setValue("name", "", { shouldDirty: false });
    setValue("symbol", "", { shouldDirty: false });
    setValue("providerSymbol", "", { shouldDirty: false });
    setValue("exchange", "", { shouldDirty: false });
    setValue("marketCurrencyCode", "", { shouldDirty: false });
    setValue("unit", "", { shouldDirty: false });
    setValue("pricingUnit", "", { shouldDirty: false });
  }, [selectedBenchmarkKey, setValue]);

  function applyBenchmark(benchmarkKey: CommodityBenchmarkKey) {
    const benchmark = COMMODITY_BENCHMARKS[benchmarkKey];

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
    setValue("exchange", benchmark.exchange, { shouldDirty: true });
    setValue("marketCurrencyCode", benchmark.marketCurrencyCode, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("unit", benchmark.unit, { shouldDirty: true });
    setValue("pricingUnit", benchmark.pricingUnit, { shouldDirty: true });
    setValue("manualPrice", "", { shouldDirty: true });
  }

  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-sm font-semibold text-slate-900">
        Commodity Benchmark
      </label>

      <select
        value={selectedBenchmarkKey}
        onChange={(event) => {
          const value = event.target.value as CommodityBenchmarkKey;
          if (value in COMMODITY_BENCHMARKS) applyBenchmark(value);
        }}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="" disabled>
          Select WTI Crude Oil or Copper
        </option>
        <option value="WTI_CRUDE_OIL">WTI Crude Oil</option>
        <option value="COPPER">Copper</option>
      </select>

      <p className="text-xs leading-5 text-slate-500">
        {selectedBenchmark
          ? `Holding quantity is entered in ${selectedBenchmark.unitLabel}. WealthWise uses the Yahoo Finance futures benchmark only as a price reference; it does not treat this holding as a full futures contract.`
          : "Select a benchmark. WTI uses USD per barrel; Copper uses USD per pound and WealthWise converts kilograms to pounds automatically."}
      </p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
