"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";

import {
  getDefaultInvestmentAssetV2FormValues,
  getDefaultInvestmentTransactionV2FormValues,
} from "@/constants/investment-v2-form-defaults";

import { useFinance } from "@/features/finance/components/finance-provider";

import InvestmentV2ExistingTransactionFields from "@/features/investments/components/investment-v2-existing-transaction-fields";
import InvestmentV2ModeSelector from "@/features/investments/components/investment-v2-mode-selector";
import InvestmentV2NewAssetFields from "@/features/investments/components/investment-v2-new-asset-fields";

import {
  transformInvestmentAssetV2FormValues,
  transformInvestmentTransactionV2FormValues,
} from "@/features/investments/lib/investment-v2-form-transformers";

import {
  createInvestmentAssetV2FormSchema,
  createInvestmentTransactionV2FormSchema,
} from "@/features/investments/schemas/investment-v2-form.schema";

import type {
  CreateInvestmentAssetV2FormValues,
  CreateInvestmentTransactionV2FormValues,
  InvestmentV2DialogMode,
} from "@/types/investment-v2-form";

type AddInvestmentV2DialogProps = {
  open: boolean;

  onOpenChange: (open: boolean) => void;
};

export default function AddInvestmentV2Dialog({
  open,
  onOpenChange,
}: AddInvestmentV2DialogProps) {
  const {
    investmentPortfolioV2,

    isInvestmentPortfolioV2Loading,
    investmentPortfolioV2Error,

    createInvestmentAsset,
    addInvestmentTransaction,
  } = useFinance();

  const [mode, setMode] = useState<InvestmentV2DialogMode>("NEW_ASSET");

  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultTransactionCurrency =
    investmentPortfolioV2?.meta.displayCurrency ?? "USD";

  // =====================================================
  // NEW ASSET FORM
  // =====================================================

  const newAssetForm = useForm<CreateInvestmentAssetV2FormValues>({
    resolver: zodResolver(createInvestmentAssetV2FormSchema),

    defaultValues: getDefaultInvestmentAssetV2FormValues(
      defaultTransactionCurrency,
    ),
  });

  // =====================================================
  // EXISTING ASSET TRANSACTION FORM
  // =====================================================

  const existingTransactionForm =
    useForm<CreateInvestmentTransactionV2FormValues>({
      resolver: zodResolver(createInvestmentTransactionV2FormSchema),

      defaultValues: getDefaultInvestmentTransactionV2FormValues(
        defaultTransactionCurrency,
      ),
    });

  const resetNewAssetForm = newAssetForm.reset;

  const resetExistingTransactionForm = existingTransactionForm.reset;

  // =====================================================
  // KEEP DEFAULT CURRENCY CURRENT WHILE DIALOG IS CLOSED
  // =====================================================

  useEffect(() => {
    if (open) {
      return;
    }

    resetNewAssetForm(
      getDefaultInvestmentAssetV2FormValues(defaultTransactionCurrency),
    );

    resetExistingTransactionForm(
      getDefaultInvestmentTransactionV2FormValues(defaultTransactionCurrency),
    );
  }, [
    open,
    defaultTransactionCurrency,
    resetNewAssetForm,
    resetExistingTransactionForm,
  ]);

  // =====================================================
  // RESET DIALOG
  // =====================================================

  function resetDialog() {
    setMode("NEW_ASSET");

    setSubmitError(null);

    resetNewAssetForm(
      getDefaultInvestmentAssetV2FormValues(defaultTransactionCurrency),
    );

    resetExistingTransactionForm(
      getDefaultInvestmentTransactionV2FormValues(defaultTransactionCurrency),
    );
  }

  function handleCloseDialog() {
    resetDialog();

    onOpenChange(false);
  }

  function handleDialogOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetDialog();
    }

    onOpenChange(nextOpen);
  }

  function handleModeChange(nextMode: InvestmentV2DialogMode) {
    setSubmitError(null);

    setMode(nextMode);
  }

  // =====================================================
  // CREATE NEW ASSET
  // =====================================================

  async function handleCreateAsset(values: CreateInvestmentAssetV2FormValues) {
    try {
      setSubmitError(null);

      const payload = transformInvestmentAssetV2FormValues(values);

      await createInvestmentAsset(payload);

      resetDialog();

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create investment asset:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create investment asset.",
      );
    }
  }

  // =====================================================
  // ADD TRANSACTION TO EXISTING ASSET
  // =====================================================

  async function handleAddTransaction(
    values: CreateInvestmentTransactionV2FormValues,
  ) {
    try {
      setSubmitError(null);

      const payload = transformInvestmentTransactionV2FormValues(values);

      await addInvestmentTransaction(values.assetId, payload);

      resetDialog();

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add investment transaction:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to add investment transaction.",
      );
    }
  }

  // =====================================================
  // ACTIVE FORM
  // =====================================================

  const isNewAssetMode = mode === "NEW_ASSET";

  const isSubmitting = isNewAssetMode
    ? newAssetForm.formState.isSubmitting
    : existingTransactionForm.formState.isSubmitting;

  const handleActiveSubmit = isNewAssetMode
    ? newAssetForm.handleSubmit(handleCreateAsset)
    : existingTransactionForm.handleSubmit(handleAddTransaction);

  const submitLabel = isNewAssetMode ? "Add New Asset" : "Add Transaction";

  const valuations = investmentPortfolioV2?.data ?? [];

  return (
    <FormDialogShell
      open={open}
      onOpenChange={handleDialogOpenChange}
      title="Add Investment"
      description="Create a new investment asset or record a transaction for an existing asset."
      formProps={{
        onSubmit: handleActiveSubmit,
      }}
      footer={
        <FormDialogFooter
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
          onCancel={handleCloseDialog}
        />
      }
    >
      <div className="space-y-6">
        <InvestmentV2ModeSelector mode={mode} onModeChange={handleModeChange} />

        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{submitError}</p>
          </div>
        ) : null}

        {isNewAssetMode ? (
          <InvestmentV2NewAssetFields
            register={newAssetForm.register}
            errors={newAssetForm.formState.errors}
            watch={newAssetForm.watch}
            setValue={newAssetForm.setValue}
          />
        ) : (
          <>
            {isInvestmentPortfolioV2Loading ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Loading investment assets...
                </p>
              </div>
            ) : null}

            {!isInvestmentPortfolioV2Loading && investmentPortfolioV2Error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  {investmentPortfolioV2Error}
                </p>
              </div>
            ) : null}

            {!isInvestmentPortfolioV2Loading &&
            !investmentPortfolioV2Error &&
            valuations.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  No investment assets yet
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Create your first investment asset before adding additional
                  transactions.
                </p>
              </div>
            ) : null}

            {!isInvestmentPortfolioV2Loading &&
            !investmentPortfolioV2Error &&
            valuations.length > 0 ? (
              <InvestmentV2ExistingTransactionFields
                valuations={valuations}
                register={existingTransactionForm.register}
                errors={existingTransactionForm.formState.errors}
                watch={existingTransactionForm.watch}
                setValue={existingTransactionForm.setValue}
              />
            ) : null}
          </>
        )}
      </div>
    </FormDialogShell>
  );
}
