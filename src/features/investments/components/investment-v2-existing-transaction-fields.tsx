"use client";

import { useEffect } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";

import { CURRENCY_OPTIONS } from "@/constants/finance-options";

import type { InvestmentValuationItem } from "@/types/investment-v2";

import type { CreateInvestmentTransactionV2FormValues } from "@/types/investment-v2-form";

type InvestmentV2ExistingTransactionFieldsProps = {
  valuations: InvestmentValuationItem[];

  register: UseFormRegister<CreateInvestmentTransactionV2FormValues>;

  errors: FieldErrors<CreateInvestmentTransactionV2FormValues>;

  watch: UseFormWatch<CreateInvestmentTransactionV2FormValues>;

  setValue: UseFormSetValue<CreateInvestmentTransactionV2FormValues>;
};

export default function InvestmentV2ExistingTransactionFields({
  valuations,
  register,
  errors,
  watch,
  setValue,
}: InvestmentV2ExistingTransactionFieldsProps) {
  const assetId = watch("assetId");

  const transactionType = watch("type");

  const selectedAsset =
    valuations.find((valuation) => valuation.assetId === assetId) ?? null;

  const assetOptions = valuations.map((valuation) => ({
    value: valuation.assetId,

    label: valuation.symbol
      ? `${valuation.name} (${valuation.symbol})`
      : valuation.name,
  }));

  const isQuantityPosition = selectedAsset?.positionKind === "QUANTITY";

  const isPrincipalPosition = selectedAsset?.positionKind === "PRINCIPAL";

  const hasQuantity = (selectedAsset?.quantity ?? 0) > 0;

  const hasPrincipal = (selectedAsset?.principalBalance ?? 0) > 0;

  const transactionTypeOptions = isQuantityPosition
    ? [
        {
          value: "BUY",
          label: "Buy",
        },

        ...(hasQuantity
          ? [
              {
                value: "SELL",
                label: "Sell",
              },
            ]
          : []),
      ]
    : isPrincipalPosition
      ? [
          {
            value: "OPEN",
            label: "Add / Open Principal",
          },

          ...(hasPrincipal
            ? [
                {
                  value: "CLOSE",
                  label: "Close Principal",
                },
              ]
            : []),
        ]
      : [];

  const transactionCurrencyOptions = selectedAsset?.transactionCurrencyCode
    ? [
        {
          value: selectedAsset.transactionCurrencyCode,

          label: selectedAsset.transactionCurrencyCode,
        },
      ]
    : CURRENCY_OPTIONS;

  // =====================================================
  // SELECTED ASSET CHANGE
  // =====================================================

  useEffect(() => {
    if (!selectedAsset) {
      return;
    }

    if (selectedAsset.positionKind === "QUANTITY") {
      setValue("type", "BUY", {
        shouldValidate: true,
      });
    }

    if (selectedAsset.positionKind === "PRINCIPAL") {
      setValue("type", "OPEN", {
        shouldValidate: true,
      });

      setValue("quantity", "");
    }

    if (selectedAsset.transactionCurrencyCode) {
      setValue("currencyCode", selectedAsset.transactionCurrencyCode, {
        shouldValidate: true,
      });
    }
  }, [selectedAsset, setValue]);

  // =====================================================
  // TRANSACTION TYPE CHANGE
  // =====================================================

  useEffect(() => {
    if (transactionType === "OPEN" || transactionType === "CLOSE") {
      setValue("quantity", "");
    }
  }, [transactionType, setValue]);

  return (
    <div className="space-y-6">
      {/* =================================================
          ASSET
      ================================================= */}

      <div>
        <p className="mb-4 text-sm font-bold text-slate-900">
          Investment Asset
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            label="Asset"
            options={assetOptions}
            error={errors.assetId?.message}
            registration={register("assetId")}
          />

          {selectedAsset ? (
            <FormSelect
              label="Transaction Type"
              options={transactionTypeOptions}
              error={errors.type?.message}
              registration={register("type")}
            />
          ) : null}
        </div>

        {selectedAsset ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {selectedAsset.name}
              {selectedAsset.symbol ? ` (${selectedAsset.symbol})` : ""}
            </p>

            <div className="mt-2 space-y-1 text-sm text-slate-500">
              <p>Category: {selectedAsset.category}</p>

              {isQuantityPosition ? (
                <p>Current quantity: {selectedAsset.quantity ?? 0}</p>
              ) : null}

              {isPrincipalPosition ? (
                <p>Current principal: {selectedAsset.principalBalance ?? 0}</p>
              ) : null}

              {selectedAsset.transactionCurrencyCode ? (
                <p>
                  Transaction currency: {selectedAsset.transactionCurrencyCode}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* =================================================
          TRANSACTION DETAILS
      ================================================= */}

      {selectedAsset ? (
        <div className="border-t border-slate-200 pt-6">
          <div className="mb-4">
            <p className="text-sm font-bold text-slate-900">
              Transaction Details
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Record a new transaction for this investment asset.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {isQuantityPosition ? (
              <FormInput
                label={
                  transactionType === "SELL"
                    ? "Quantity to Sell"
                    : "Quantity to Buy"
                }
                type="number"
                min="0"
                step="any"
                placeholder="0.001"
                error={errors.quantity?.message}
                registration={register("quantity")}
              />
            ) : null}

            <FormInput
              label={
                transactionType === "SELL"
                  ? "Sale Proceeds"
                  : transactionType === "CLOSE"
                    ? "Principal to Close"
                    : transactionType === "OPEN"
                      ? "Principal Amount"
                      : "Purchase Amount"
              }
              type="number"
              min="0"
              step="0.01"
              placeholder="1000"
              error={errors.grossAmount?.message}
              registration={register("grossAmount")}
            />

            <FormInput
              label="Transaction Fee"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              error={errors.feeAmount?.message}
              registration={register("feeAmount")}
            />

            <FormSelect
              label="Transaction Currency"
              options={transactionCurrencyOptions}
              error={errors.currencyCode?.message}
              registration={register("currencyCode")}
            />

            <FormInput
              label="Transaction Date"
              type="date"
              error={errors.transactedAt?.message}
              registration={register("transactedAt")}
            />

            <FormTextarea
              label="Notes"
              placeholder="Optional notes about this transaction"
              error={errors.notes?.message}
              registration={register("notes")}
              className="md:col-span-2"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
