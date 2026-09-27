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

import { transformInvestmentEventV2FormValues } from "@/features/investments/lib/investment-v2-form-transformers";

import { createInvestmentEventV2FormSchema } from "@/features/investments/schemas/investment-v2-form.schema";

import type { InvestmentValuationItem } from "@/types/investment-v2";

import type {
  CreateInvestmentEventV2FormValues,
  InvestmentEventV2FormType,
} from "@/types/investment-v2-form";

type AddInvestmentEventV2DialogProps = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  asset: InvestmentValuationItem | null;
};

function getTodayInputValue() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultEventType(
  asset: InvestmentValuationItem | null,
): InvestmentEventV2FormType {
  if (asset?.instrumentType === "BOND") {
    return "COUPON";
  }

  return "INTEREST";
}

function getDefaultFormValues(
  asset: InvestmentValuationItem | null,
): CreateInvestmentEventV2FormValues {
  return {
    type: getDefaultEventType(asset),

    grossAmount: "",
    feeAmount: "",
    taxAmount: "",

    currencyCode: asset?.transactionCurrencyCode ?? "",

    occurredAt: getTodayInputValue(),

    notes: "",
  };
}

function getInvestmentEventErrorMessage(error: unknown) {
  if (error instanceof InvestmentV2ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to create investment event.";
}

export default function AddInvestmentEventV2Dialog({
  open,
  onOpenChange,
  asset,
}: AddInvestmentEventV2DialogProps) {
  const { addInvestmentEventV2 } = useFinance();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CreateInvestmentEventV2FormValues>({
    resolver: zodResolver(createInvestmentEventV2FormSchema),

    defaultValues: getDefaultFormValues(asset),
  });

  const reset = form.reset;

  const eventType = form.watch("type");

  const isCashEvent = eventType === "INTEREST" || eventType === "COUPON";

  // =====================================================
  // LOAD ASSET DEFAULTS
  // =====================================================

  useEffect(() => {
    if (!open || !asset) {
      return;
    }

    setSubmitError(null);

    reset(getDefaultFormValues(asset));
  }, [open, asset, reset]);

  // =====================================================
  // CLOSE
  // =====================================================

  function handleCloseDialog() {
    setSubmitError(null);

    reset(getDefaultFormValues(asset));

    onOpenChange(false);
  }

  function handleDialogOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSubmitError(null);

      reset(getDefaultFormValues(asset));
    }

    onOpenChange(nextOpen);
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(values: CreateInvestmentEventV2FormValues) {
    if (!asset) {
      return;
    }

    try {
      setSubmitError(null);

      const payload = transformInvestmentEventV2FormValues(values);

      await addInvestmentEventV2(asset.assetId, payload);

      reset(getDefaultFormValues(asset));

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create investment event:", error);

      setSubmitError(getInvestmentEventErrorMessage(error));
    }
  }

  const errors = form.formState.errors;

  // =====================================================
  // SUPPORTED EVENT TYPES
  // =====================================================

  const isDeposit = asset?.instrumentType === "DEPOSIT";

  const isBond = asset?.instrumentType === "BOND";

  return (
    <FormDialogShell
      open={open}
      onOpenChange={handleDialogOpenChange}
      title="Record Investment Event"
      description="Record realized investment income or an investment lifecycle event."
      formProps={{
        onSubmit: form.handleSubmit(handleSubmit),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Record Event"
          isSubmitting={form.formState.isSubmitting}
          onCancel={handleCloseDialog}
        />
      }
    >
      <div className="space-y-6">
        {/* =================================================
            ERROR
        ================================================= */}

        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{submitError}</p>
          </div>
        ) : null}

        {/* =================================================
            SELECTED ASSET
        ================================================= */}

        {asset ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Investment
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {asset.symbol ? `${asset.name} (${asset.symbol})` : asset.name}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {asset.category}
              {" • "}
              {asset.instrumentType}
            </p>
          </div>
        ) : null}

        {/* =================================================
            EVENT TYPE
        ================================================= */}

        <div className="space-y-2">
          <label
            htmlFor="investment-event-type"
            className="text-sm font-semibold text-slate-700"
          >
            Event Type
          </label>

          <select
            id="investment-event-type"
            {...form.register("type")}
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
          >
            {isDeposit ? (
              <>
                <option value="INTEREST">Interest</option>

                <option value="MATURITY">Maturity</option>
              </>
            ) : null}

            {isBond ? (
              <>
                <option value="COUPON">Coupon</option>

                <option value="MATURITY">Maturity</option>
              </>
            ) : null}
          </select>

          {errors.type ? (
            <p className="text-xs font-medium text-red-600">
              {errors.type.message}
            </p>
          ) : null}
        </div>

        {/* =================================================
            CASH INCOME
        ================================================= */}

        {isCashEvent ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="investment-event-gross-amount"
                  className="text-sm font-semibold text-slate-700"
                >
                  Gross Amount
                </label>

                <Input
                  id="investment-event-gross-amount"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  {...form.register("grossAmount")}
                  placeholder="0"
                />

                {errors.grossAmount ? (
                  <p className="text-xs font-medium text-red-600">
                    {errors.grossAmount.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="investment-event-currency"
                  className="text-sm font-semibold text-slate-700"
                >
                  Currency
                </label>

                <Input
                  id="investment-event-currency"
                  {...form.register("currencyCode")}
                  maxLength={3}
                  placeholder="USD"
                />

                {errors.currencyCode ? (
                  <p className="text-xs font-medium text-red-600">
                    {errors.currencyCode.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="investment-event-fee"
                  className="text-sm font-semibold text-slate-700"
                >
                  Fee
                </label>

                <Input
                  id="investment-event-fee"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  {...form.register("feeAmount")}
                  placeholder="0"
                />

                {errors.feeAmount ? (
                  <p className="text-xs font-medium text-red-600">
                    {errors.feeAmount.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="investment-event-tax"
                  className="text-sm font-semibold text-slate-700"
                >
                  Tax
                </label>

                <Input
                  id="investment-event-tax"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  {...form.register("taxAmount")}
                  placeholder="0"
                />

                {errors.taxAmount ? (
                  <p className="text-xs font-medium text-red-600">
                    {errors.taxAmount.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs leading-5 text-slate-500">
                Gross amount is the income before fees and taxes. Net realized
                investment income will be calculated as gross amount minus fee
                and tax.
              </p>
            </div>
          </div>
        ) : null}

        {/* =================================================
            EVENT DATE
        ================================================= */}

        <div className="space-y-2">
          <label
            htmlFor="investment-event-date"
            className="text-sm font-semibold text-slate-700"
          >
            Event Date
          </label>

          <Input
            id="investment-event-date"
            type="date"
            {...form.register("occurredAt")}
          />

          {errors.occurredAt ? (
            <p className="text-xs font-medium text-red-600">
              {errors.occurredAt.message}
            </p>
          ) : null}
        </div>

        {/* =================================================
            MATURITY INFO
        ================================================= */}

        {eventType === "MATURITY" ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-semibold text-amber-800">
              Maturity is recorded as a lifecycle event.
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              Recording maturity does not automatically return principal or
              change the current holding balance.
            </p>
          </div>
        ) : null}

        {/* =================================================
            NOTES
        ================================================= */}

        <div className="space-y-2">
          <label
            htmlFor="investment-event-notes"
            className="text-sm font-semibold text-slate-700"
          >
            Notes
          </label>

          <Textarea
            id="investment-event-notes"
            {...form.register("notes")}
            placeholder="Optional notes about this investment event..."
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
