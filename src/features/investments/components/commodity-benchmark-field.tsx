"use client";

import { useEffect } from "react";
import type { UseFormSetValue } from "react-hook-form";

import type { CreateInvestmentAssetV2FormValues } from "@/types/investment-v2-form";

type DirectCommodityInstrument =
  | "PHYSICAL_COMMODITY"
  | "DIGITAL_COMMODITY";

type DirectCommodityValuation = "MARKET_PRICE" | "MANUAL";

type CommodityBenchmarkFieldProps = {
  instrumentType: DirectCommodityInstrument;
  valuationType: DirectCommodityValuation;
  symbol: string;
  setValue: UseFormSetValue<CreateInvestmentAssetV2FormValues>;
  error?: string;
};

const COMMODITY_METALS = {
  GOLD: {
    name: "Gold",
    symbol: "XAU",
    providerSymbol: "GC=F",
    exchange: "COMEX",
    marketCurrencyCode: "USD",
  },
  SILVER: {
    name: "Silver",
    symbol: "XAG",
    providerSymbol: "SI=F",
    exchange: "COMEX",
    marketCurrencyCode: "USD",
  },
} as const;

type CommodityMetalKey = keyof typeof COMMODITY_METALS;

function getSelectedMetalKey(symbol: string): CommodityMetalKey | "" {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (normalizedSymbol === "XAU") {
    return "GOLD";
  }

  if (normalizedSymbol === "XAG") {
    return "SILVER";
  }

  return "";
}

export default function CommodityBenchmarkField({
  instrumentType,
  valuationType,
  symbol,
  setValue,
  error,
}: CommodityBenchmarkFieldProps) {
  const selectedMetalKey = getSelectedMetalKey(symbol);

  function applyMetal(
    metalKey: CommodityMetalKey,
    shouldDirty: boolean,
  ) {
    const metal = COMMODITY_METALS[metalKey];
    const assetPrefix =
      instrumentType === "DIGITAL_COMMODITY" ? "Digital " : "Physical ";

    setValue("name", `${assetPrefix}${metal.name}`, {
      shouldDirty,
      shouldValidate: true,
    });

    setValue("symbol", metal.symbol, {
      shouldDirty,
      shouldValidate: true,
    });

    setValue("unit", "GRAM", { shouldDirty });

    if (valuationType === "MARKET_PRICE") {
      setValue("providerSymbol", metal.providerSymbol, {
        shouldDirty,
        shouldValidate: true,
      });
      setValue("exchange", metal.exchange, { shouldDirty });
      setValue("marketCurrencyCode", metal.marketCurrencyCode, {
        shouldDirty,
        shouldValidate: true,
      });
      setValue("pricingUnit", "TROY_OUNCE", { shouldDirty });
      setValue("manualPrice", "", { shouldDirty });
      return;
    }

    setValue("providerSymbol", "", { shouldDirty });
    setValue("exchange", "", { shouldDirty });
    setValue("marketCurrencyCode", "", {
      shouldDirty,
      shouldValidate: true,
    });
    setValue("pricingUnit", "GRAM", { shouldDirty });
  }

  useEffect(() => {
    if (!selectedMetalKey) {
      return;
    }

    applyMetal(selectedMetalKey, false);
    // setValue is stable from react-hook-form. Re-apply only when the
    // structural commodity selection or pricing source changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrumentType, valuationType]);

  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-sm font-semibold text-slate-900">
        Commodity Metal
      </label>

      <select
        value={selectedMetalKey}
        onChange={(event) => {
          const value = event.target.value as CommodityMetalKey;

          if (value in COMMODITY_METALS) {
            applyMetal(value, true);
          }
        }}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="" disabled>
          Select Gold or Silver
        </option>
        <option value="GOLD">Gold</option>
        <option value="SILVER">Silver</option>
      </select>

      <p className="text-xs leading-5 text-slate-500">
        {valuationType === "MARKET_PRICE"
          ? "Quantity is stored in grams. WealthWise converts grams to troy ounces before applying the Yahoo Finance COMEX benchmark price."
          : "Quantity and provider buyback price are both stored per gram, so fractional digital holdings such as 0.001 g are supported."}
      </p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
