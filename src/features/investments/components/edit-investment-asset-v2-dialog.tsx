"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { useFinance } from "@/features/finance/components/finance-provider";

import { InvestmentV2ApiError } from "@/features/investments/api/investment-v2-api";

import { transformEditInvestmentAssetV2FormValues } from "@/features/investments/lib/investment-v2-form-transformers";

import { editInvestmentAssetV2FormSchema } from "@/features/investments/schemas/investment-v2-form.schema";

import type { InvestmentValuationItem } from "@/types/investment-v2";

import type { EditInvestmentAssetV2FormValues } from "@/types/investment-v2-form";

type EditInvestmentAssetV2DialogProps = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  asset: InvestmentValuationItem | null;
};

function assetToFormValues(
  asset: InvestmentValuationItem,
): EditInvestmentAssetV2FormValues {
  return {
    name: asset.name,

    symbol: asset.symbol ?? "",

    exchange: asset.exchange ?? "",

    isin: asset.isin ?? "",

    issuer: asset.issuer ?? "",

    underlyingIndex: asset.underlyingIndex ?? "",

    notes: asset.notes ?? "",
  };
}

function getInvestmentAssetErrorMessage(error: unknown) {
  if (error instanceof InvestmentV2ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to update investment asset.";
}

export default function EditInvestmentAssetV2Dialog({
  open,
  onOpenChange,
  asset,
}: EditInvestmentAssetV2DialogProps) {
  const { updateInvestmentAssetV2 } = useFinance();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<EditInvestmentAssetV2FormValues>({
    resolver: zodResolver(editInvestmentAssetV2FormSchema),

    defaultValues: {
      name: "",
      symbol: "",
      exchange: "",
      isin: "",
      issuer: "",
      underlyingIndex: "",
      notes: "",
    },
  });

  const reset = form.reset;

  // =====================================================
  // LOAD ASSET INTO FORM
  // =====================================================

  useEffect(() => {
    if (!open || !asset) {
      return;
    }

    setSubmitError(null);

    reset(assetToFormValues(asset));
  }, [open, asset, reset]);

  // =====================================================
  // CLOSE
  // =====================================================

  function handleCloseDialog() {
    setSubmitError(null);

    onOpenChange(false);
  }

  function handleDialogOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSubmitError(null);
    }

    onOpenChange(nextOpen);
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(values: EditInvestmentAssetV2FormValues) {
    if (!asset) {
      return;
    }

    try {
      setSubmitError(null);

      const payload = transformEditInvestmentAssetV2FormValues(values);

      await updateInvestmentAssetV2(asset.assetId, payload);

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update investment asset:", error);

      setSubmitError(getInvestmentAssetErrorMessage(error));
    }
  }

  const errors = form.formState.errors;

  return (
    <FormDialogShell
      open={open}
      onOpenChange={handleDialogOpenChange}
      title="Edit Investment Asset"
      description="Update the identity and descriptive information for this investment asset."
      formProps={{
        onSubmit: form.handleSubmit(handleSubmit),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Save Changes"
          isSubmitting={form.formState.isSubmitting}
          onCancel={handleCloseDialog}
        />
      }
    >
      <div className="space-y-6">
        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{submitError}</p>
          </div>
        ) : null}

        {asset ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Investment Structure
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {asset.category}
              {" • "}
              {asset.instrumentType}
              {" • "}
              {asset.valuationType}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Structural investment settings are locked because changing them
              could make the existing transaction history inconsistent.
            </p>
          </div>
        ) : null}

        <div className="space-y-2">
          <label
            htmlFor="edit-investment-asset-name"
            className="text-sm font-semibold text-slate-700"
          >
            Asset Name
          </label>

          <Input
            id="edit-investment-asset-name"
            {...form.register("name")}
            placeholder="Bitcoin"
          />

          {errors.name ? (
            <p className="text-xs font-medium text-red-600">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="edit-investment-asset-symbol"
              className="text-sm font-semibold text-slate-700"
            >
              Symbol
            </label>

            <Input
              id="edit-investment-asset-symbol"
              {...form.register("symbol")}
              placeholder="BTC"
            />

            {errors.symbol ? (
              <p className="text-xs font-medium text-red-600">
                {errors.symbol.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-investment-asset-exchange"
              className="text-sm font-semibold text-slate-700"
            >
              Exchange
            </label>

            <Input
              id="edit-investment-asset-exchange"
              {...form.register("exchange")}
              placeholder="NASDAQ, NYSE, Coinbase..."
            />

            {errors.exchange ? (
              <p className="text-xs font-medium text-red-600">
                {errors.exchange.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-investment-asset-isin"
              className="text-sm font-semibold text-slate-700"
            >
              ISIN
            </label>

            <Input
              id="edit-investment-asset-isin"
              {...form.register("isin")}
              placeholder="Optional"
            />

            {errors.isin ? (
              <p className="text-xs font-medium text-red-600">
                {errors.isin.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-investment-asset-issuer"
              className="text-sm font-semibold text-slate-700"
            >
              Issuer
            </label>

            <Input
              id="edit-investment-asset-issuer"
              {...form.register("issuer")}
              placeholder="Optional"
            />

            {errors.issuer ? (
              <p className="text-xs font-medium text-red-600">
                {errors.issuer.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="edit-investment-asset-underlying-index"
            className="text-sm font-semibold text-slate-700"
          >
            Underlying Index
          </label>

          <Input
            id="edit-investment-asset-underlying-index"
            {...form.register("underlyingIndex")}
            placeholder="S&P 500, Nasdaq-100..."
          />

          {errors.underlyingIndex ? (
            <p className="text-xs font-medium text-red-600">
              {errors.underlyingIndex.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="edit-investment-asset-notes"
            className="text-sm font-semibold text-slate-700"
          >
            Notes
          </label>

          <Textarea
            id="edit-investment-asset-notes"
            {...form.register("notes")}
            placeholder="Optional notes about this asset..."
            rows={4}
          />

          {errors.notes ? (
            <p className="text-xs font-medium text-red-600">
              {errors.notes.message}
            </p>
          ) : null}
        </div>
      </div>
    </FormDialogShell>
  );
}
