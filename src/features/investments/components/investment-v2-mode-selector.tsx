"use client";

import type { InvestmentV2DialogMode } from "@/types/investment-v2-form";

type InvestmentV2ModeSelectorProps = {
  mode: InvestmentV2DialogMode;

  onModeChange: (mode: InvestmentV2DialogMode) => void;
};

export default function InvestmentV2ModeSelector({
  mode,
  onModeChange,
}: InvestmentV2ModeSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          What would you like to do?
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Create a new investment asset or add a transaction to an asset you
          already own.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onModeChange("NEW_ASSET")}
          className={[
            "rounded-2xl border p-4 text-left transition",
            mode === "NEW_ASSET"
              ? "border-emerald-600 bg-emerald-50"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
          ].join(" ")}
        >
          <p className="text-sm font-bold text-slate-900">Add New Asset</p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Create a new asset and record its first investment transaction.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("EXISTING_ASSET_TRANSACTION")}
          className={[
            "rounded-2xl border p-4 text-left transition",
            mode === "EXISTING_ASSET_TRANSACTION"
              ? "border-emerald-600 bg-emerald-50"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
          ].join(" ")}
        >
          <p className="text-sm font-bold text-slate-900">Add Transaction</p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Buy, sell, open, or close a position for an existing investment
            asset.
          </p>
        </button>
      </div>
    </div>
  );
}
