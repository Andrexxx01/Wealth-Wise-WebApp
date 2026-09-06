"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useForm,
} from "react-hook-form";

import FormDialogFooter from "@/components/form/form-dialog-footer";
import FormDialogShell from "@/components/form/form-dialog-shell";

import {
  useFinance,
} from "@/features/finance/components/finance-provider";

import InvestmentV2ExistingTransactionFields from "@/features/investments/components/investment-v2-existing-transaction-fields";

import {
  InvestmentV2ApiError,
} from "@/features/investments/api/investment-v2-api";

import {
  transformInvestmentTransactionV2FormValues,
} from "@/features/investments/lib/investment-v2-form-transformers";

import {
  createInvestmentTransactionV2FormSchema,
} from "@/features/investments/schemas/investment-v2-form.schema";

import type {
  InvestmentRecentTransactionV2Item,
} from "@/types/investment-v2";

import type {
  CreateInvestmentTransactionV2FormValues,
} from "@/types/investment-v2-form";


type EditInvestmentTransactionV2DialogProps = {
  open: boolean;

  onOpenChange:
    (open: boolean) => void;

  transaction:
    InvestmentRecentTransactionV2Item |
    null;
};


function transactionDateToInputValue(
  dateValue: string,
) {
  const date =
    new Date(
      dateValue,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return date
    .toISOString()
    .slice(
      0,
      10,
    );
}


function transactionToFormValues(
  transaction:
    InvestmentRecentTransactionV2Item,
): CreateInvestmentTransactionV2FormValues {
  return {
    assetId:
      transaction.assetId,

    type:
      transaction.type,

    quantity:
      transaction.quantity ===
      null
        ? ""
        : String(
            transaction.quantity,
          ),

    grossAmount:
      String(
        transaction.grossAmount,
      ),

    feeAmount:
      String(
        transaction.feeAmount,
      ),

    currencyCode:
      transaction.currencyCode,

    transactedAt:
      transactionDateToInputValue(
        transaction.transactedAt,
      ),

    notes:
      transaction.notes ??
      "",
  };
}


function getInvestmentTransactionErrorMessage(
  error: unknown,
) {
  if (
    error instanceof
    InvestmentV2ApiError
  ) {
    /*
     * PATCH chain validation mengembalikan:
     *
     * data: {
     *   reason: "..."
     * }
     */
    if (
      error.data &&
      typeof error.data ===
        "object" &&
      "reason" in
        error.data
    ) {
      const reason =
        (
          error.data as {
            reason?: unknown;
          }
        ).reason;

      if (
        typeof reason ===
          "string" &&
        reason.trim()
      ) {
        return `${error.message} ${reason}`;
      }
    }

    return error.message;
  }

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Failed to update investment transaction.";
}


export default function EditInvestmentTransactionV2Dialog({
  open,
  onOpenChange,
  transaction,
}: EditInvestmentTransactionV2DialogProps) {
  const {
    investmentPortfolioV2,

    isInvestmentPortfolioV2Loading,
    investmentPortfolioV2Error,

    updateInvestmentTransactionV2,
  } =
    useFinance();


  const [
    submitError,
    setSubmitError,
  ] =
    useState<
      string | null
    >(null);


  const form =
    useForm<CreateInvestmentTransactionV2FormValues>({
      resolver:
        zodResolver(
          createInvestmentTransactionV2FormSchema,
        ),

      defaultValues: {
        assetId: "",
        type: "BUY",
        quantity: "",
        grossAmount: "",
        feeAmount: "",
        currencyCode:
          "USD",
        transactedAt:
          "",
        notes: "",
      },
    });


  const reset =
    form.reset;


  // =====================================================
  // LOAD TRANSACTION INTO FORM
  // =====================================================

  useEffect(() => {
    if (
      !open ||
      !transaction
    ) {
      return;
    }

    setSubmitError(
      null,
    );

    reset(
      transactionToFormValues(
        transaction,
      ),
    );
  }, [
    open,
    transaction,
    reset,
  ]);


  // =====================================================
  // CLOSE
  // =====================================================

  function handleCloseDialog() {
    setSubmitError(
      null,
    );

    onOpenChange(
      false,
    );
  }


  function handleDialogOpenChange(
    nextOpen: boolean,
  ) {
    if (
      !nextOpen
    ) {
      setSubmitError(
        null,
      );
    }

    onOpenChange(
      nextOpen,
    );
  }


  // =====================================================
  // UPDATE
  // =====================================================

  async function handleUpdateTransaction(
    values:
      CreateInvestmentTransactionV2FormValues,
  ) {
    if (!transaction) {
      return;
    }

    try {
      setSubmitError(
        null,
      );

      const payload =
        transformInvestmentTransactionV2FormValues(
          values,
        );

      await updateInvestmentTransactionV2(
        transaction.assetId,
        transaction.id,
        payload,
      );

      onOpenChange(
        false,
      );
    } catch (error) {
      console.error(
        "Failed to update investment transaction:",
        error,
      );

      setSubmitError(
        getInvestmentTransactionErrorMessage(
          error,
        ),
      );
    }
  }


  const valuations =
    investmentPortfolioV2
      ?.data ??
    [];


  const selectedAssetExists =
    transaction
      ? valuations.some(
          (valuation) =>
            valuation.assetId ===
            transaction.assetId,
        )
      : false;


  return (
    <FormDialogShell
      open={
        open
      }
      onOpenChange={
        handleDialogOpenChange
      }
      title="Edit Investment Transaction"
      description="Update this transaction while keeping the investment history financially valid."
      formProps={{
        onSubmit:
          form.handleSubmit(
            handleUpdateTransaction,
          ),
      }}
      footer={
        <FormDialogFooter
          submitLabel="Save Changes"
          isSubmitting={
            form.formState
              .isSubmitting
          }
          onCancel={
            handleCloseDialog
          }
        />
      }
    >
      <div className="space-y-6">
        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium leading-6 text-red-700">
              {
                submitError
              }
            </p>
          </div>
        ) : null}


        {isInvestmentPortfolioV2Loading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Loading investment
              asset...
            </p>
          </div>
        ) : null}


        {!isInvestmentPortfolioV2Loading &&
        investmentPortfolioV2Error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              {
                investmentPortfolioV2Error
              }
            </p>
          </div>
        ) : null}


        {!isInvestmentPortfolioV2Loading &&
        !investmentPortfolioV2Error &&
        transaction &&
        !selectedAssetExists ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              The investment asset for
              this transaction could not
              be found.
            </p>
          </div>
        ) : null}


        {!isInvestmentPortfolioV2Loading &&
        !investmentPortfolioV2Error &&
        transaction &&
        selectedAssetExists ? (
          <InvestmentV2ExistingTransactionFields
            mode="EDIT"
            valuations={
              valuations
            }
            register={
              form.register
            }
            errors={
              form.formState
                .errors
            }
            watch={
              form.watch
            }
            setValue={
              form.setValue
            }
          />
        ) : null}
      </div>
    </FormDialogShell>
  );
}