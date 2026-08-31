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

import {
  INVESTMENT_V2_CATEGORY_CONFIG,
  INVESTMENT_V2_CATEGORY_OPTIONS,
  getInvestmentV2InstrumentConfig,
  getInvestmentV2InstrumentOptions,
} from "@/constants/investment-v2-form-options";

import type { CreateInvestmentAssetV2FormValues } from "@/types/investment-v2-form";

type InvestmentV2NewAssetFieldsProps = {
  register: UseFormRegister<CreateInvestmentAssetV2FormValues>;

  errors: FieldErrors<CreateInvestmentAssetV2FormValues>;

  watch: UseFormWatch<CreateInvestmentAssetV2FormValues>;

  setValue: UseFormSetValue<CreateInvestmentAssetV2FormValues>;
};

export default function InvestmentV2NewAssetFields({
  register,
  errors,
  watch,
  setValue,
}: InvestmentV2NewAssetFieldsProps) {
  const category = watch("category");

  const instrumentType = watch("instrumentType");

  const initialTransactionType = watch("initialTransactionType");

  const categoryConfig = INVESTMENT_V2_CATEGORY_CONFIG[category];

  const instrumentOptions = getInvestmentV2InstrumentOptions(category).map(
    (option) => ({
      value: option.value,
      label: option.label,
    }),
  );

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================

  useEffect(() => {
    const nextCategoryConfig = INVESTMENT_V2_CATEGORY_CONFIG[category];

    const nextInstrumentType = nextCategoryConfig.defaultInstrumentType;

    const nextInstrumentConfig = getInvestmentV2InstrumentConfig(
      category,
      nextInstrumentType,
    );

    setValue("instrumentType", nextInstrumentType, {
      shouldValidate: true,
    });

    if (nextInstrumentConfig) {
      setValue("valuationType", nextInstrumentConfig.valuationType, {
        shouldValidate: true,
      });
    }

    setValue(
      "initialTransactionType",
      nextCategoryConfig.initialTransactionType,
      {
        shouldValidate: true,
      },
    );

    setValue(
      "marketCurrencyCode",
      nextCategoryConfig.defaultMarketCurrencyCode,
    );

    setValue("unit", nextCategoryConfig.defaultUnit);

    setValue("pricingUnit", nextCategoryConfig.defaultPricingUnit);

    if (nextCategoryConfig.initialTransactionType === "OPEN") {
      setValue("quantity", "");
    }
  }, [category, setValue]);

  // =====================================================
  // INSTRUMENT CHANGE
  // =====================================================

  useEffect(() => {
    const instrumentConfig = getInvestmentV2InstrumentConfig(
      category,
      instrumentType,
    );

    if (!instrumentConfig) {
      return;
    }

    setValue("valuationType", instrumentConfig.valuationType, {
      shouldValidate: true,
    });
  }, [category, instrumentType, setValue]);

  const isCrypto = category === "CRYPTO";

  const isStock = category === "STOCK";

  const isDeposit = category === "DEPOSIT";

  const isIndex = category === "INDEX";

  const isBond = category === "BOND";

  const isMutualFund = category === "MUTUAL_FUND";

  const isForex = category === "FOREX";

  const isCommodity = category === "COMMODITY";

  const isEtf = instrumentType === "ETF";

  const isPhysicalCommodity = instrumentType === "PHYSICAL_COMMODITY";

  const isBuyTransaction = initialTransactionType === "BUY";

  return (
    <div className="space-y-6">
      {/* =================================================
          BASIC ASSET INFORMATION
      ================================================= */}

      <div>
        <p className="mb-4 text-sm font-bold text-slate-900">
          Asset Information
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Asset Name"
            placeholder="Bitcoin"
            error={errors.name?.message}
            registration={register("name")}
          />

          <FormSelect
            label="Category"
            options={INVESTMENT_V2_CATEGORY_OPTIONS}
            error={errors.category?.message}
            registration={register("category")}
          />

          {instrumentOptions.length > 1 ? (
            <FormSelect
              label="Instrument"
              options={instrumentOptions}
              error={errors.instrumentType?.message}
              registration={register("instrumentType")}
            />
          ) : null}

          {/* =============================================
              CRYPTO
          ============================================= */}

          {isCrypto ? (
            <>
              <FormInput
                label="Symbol"
                placeholder="BTC"
                error={errors.symbol?.message}
                registration={register("symbol")}
              />

              <FormInput
                label="Exchange"
                placeholder="Indodax"
                error={errors.exchange?.message}
                registration={register("exchange")}
              />

              <FormInput
                label="Market Currency"
                placeholder="USD"
                error={errors.marketCurrencyCode?.message}
                registration={register("marketCurrencyCode")}
              />
            </>
          ) : null}

          {/* =============================================
              STOCK
          ============================================= */}

          {isStock ? (
            <>
              <FormInput
                label="Symbol"
                placeholder="AAPL"
                error={errors.symbol?.message}
                registration={register("symbol")}
              />

              <FormInput
                label="Exchange"
                placeholder="NASDAQ"
                error={errors.exchange?.message}
                registration={register("exchange")}
              />

              <FormInput
                label="Market Currency"
                placeholder="USD"
                error={errors.marketCurrencyCode?.message}
                registration={register("marketCurrencyCode")}
              />
            </>
          ) : null}

          {/* =============================================
              DEPOSIT
          ============================================= */}

          {isDeposit ? (
            <>
              <FormInput
                label="Bank / Issuer"
                placeholder="Bank Central Asia"
                error={errors.issuer?.message}
                registration={register("issuer")}
              />

              <FormInput
                label="Annual Interest Rate (%)"
                type="number"
                min="0"
                step="0.01"
                placeholder="5.00"
                error={errors.annualInterestRate?.message}
                registration={register("annualInterestRate")}
              />

              <FormInput
                label="Maturity Date"
                type="date"
                error={errors.maturityDate?.message}
                registration={register("maturityDate")}
              />
            </>
          ) : null}

          {/* =============================================
              INDEX
          ============================================= */}

          {isIndex ? (
            <>
              <FormInput
                label="Underlying Index"
                placeholder="S&P 500"
                error={errors.underlyingIndex?.message}
                registration={register("underlyingIndex")}
              />

              {isEtf ? (
                <>
                  <FormInput
                    label="Symbol"
                    placeholder="VOO"
                    error={errors.symbol?.message}
                    registration={register("symbol")}
                  />

                  <FormInput
                    label="Exchange"
                    placeholder="NYSE Arca"
                    error={errors.exchange?.message}
                    registration={register("exchange")}
                  />
                </>
              ) : null}

              <FormInput
                label="Market Currency"
                placeholder="USD"
                error={errors.marketCurrencyCode?.message}
                registration={register("marketCurrencyCode")}
              />
            </>
          ) : null}

          {/* =============================================
              BOND
          ============================================= */}

          {isBond ? (
            <>
              <FormInput
                label="Issuer"
                placeholder="United States Treasury"
                error={errors.issuer?.message}
                registration={register("issuer")}
              />

              <FormInput
                label="ISIN"
                placeholder="US..."
                error={errors.isin?.message}
                registration={register("isin")}
              />

              <FormInput
                label="Coupon Rate (%)"
                type="number"
                min="0"
                step="0.01"
                placeholder="4.25"
                error={errors.couponRate?.message}
                registration={register("couponRate")}
              />

              <FormInput
                label="Face Value"
                type="number"
                min="0"
                step="0.01"
                placeholder="1000"
                error={errors.faceValue?.message}
                registration={register("faceValue")}
              />

              <FormInput
                label="Maturity Date"
                type="date"
                error={errors.maturityDate?.message}
                registration={register("maturityDate")}
              />

              <FormInput
                label="Market Currency"
                placeholder="USD"
                error={errors.marketCurrencyCode?.message}
                registration={register("marketCurrencyCode")}
              />
            </>
          ) : null}

          {/* =============================================
              MUTUAL FUND
          ============================================= */}

          {isMutualFund ? (
            <>
              <FormInput
                label="Fund Manager / Issuer"
                placeholder="Fund manager"
                error={errors.issuer?.message}
                registration={register("issuer")}
              />

              <FormInput
                label="Market Currency"
                placeholder="IDR"
                error={errors.marketCurrencyCode?.message}
                registration={register("marketCurrencyCode")}
              />
            </>
          ) : null}

          {/* =============================================
              FOREX HOLDING
          ============================================= */}

          {isForex ? (
            <>
              <FormInput
                label="Currency Code"
                placeholder="USD"
                error={errors.symbol?.message}
                registration={register("symbol")}
              />

              <FormInput
                label="Market Quote Currency"
                placeholder="IDR"
                error={errors.marketCurrencyCode?.message}
                registration={register("marketCurrencyCode")}
              />
            </>
          ) : null}

          {/* =============================================
              COMMODITY
          ============================================= */}

          {isCommodity ? (
            <>
              {isEtf ? (
                <>
                  <FormInput
                    label="Symbol"
                    placeholder="GLD"
                    error={errors.symbol?.message}
                    registration={register("symbol")}
                  />

                  <FormInput
                    label="Exchange"
                    placeholder="NYSE Arca"
                    error={errors.exchange?.message}
                    registration={register("exchange")}
                  />
                </>
              ) : null}

              {isPhysicalCommodity ? (
                <>
                  <FormInput
                    label="Holding Unit"
                    placeholder="GRAM"
                    error={errors.unit?.message}
                    registration={register("unit")}
                  />

                  <FormInput
                    label="Market Pricing Unit"
                    placeholder="TROY_OUNCE"
                    error={errors.pricingUnit?.message}
                    registration={register("pricingUnit")}
                  />
                </>
              ) : null}

              <FormInput
                label="Market Currency"
                placeholder="USD"
                error={errors.marketCurrencyCode?.message}
                registration={register("marketCurrencyCode")}
              />
            </>
          ) : null}

          <FormTextarea
            label="Asset Notes"
            placeholder="Optional notes about this asset"
            error={errors.assetNotes?.message}
            registration={register("assetNotes")}
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* =================================================
          INITIAL TRANSACTION
      ================================================= */}

      <div className="border-t border-slate-200 pt-6">
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-900">
            {isBuyTransaction ? "Initial Purchase" : "Initial Deposit"}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {isBuyTransaction
              ? "Record the first purchase for this investment asset."
              : "Record the principal used to open this investment."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {isBuyTransaction ? (
            <FormInput
              label="Quantity"
              type="number"
              min="0"
              step="any"
              placeholder="0.001"
              error={errors.quantity?.message}
              registration={register("quantity")}
            />
          ) : null}

          <FormInput
            label={isBuyTransaction ? "Invested Amount" : "Principal Amount"}
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
            options={CURRENCY_OPTIONS}
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
            label="Transaction Notes"
            placeholder="Optional notes about this transaction"
            error={errors.transactionNotes?.message}
            registration={register("transactionNotes")}
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}
