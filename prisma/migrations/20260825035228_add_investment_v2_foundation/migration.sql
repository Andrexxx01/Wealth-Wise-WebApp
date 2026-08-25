-- CreateEnum
CREATE TYPE "InvestmentCategory" AS ENUM ('CRYPTO', 'STOCK', 'DEPOSIT', 'INDEX', 'BOND', 'MUTUAL_FUND', 'FOREX', 'COMMODITY');

-- CreateEnum
CREATE TYPE "InvestmentInstrumentType" AS ENUM ('CRYPTO_ASSET', 'COMMON_STOCK', 'ETF', 'DEPOSIT', 'BOND', 'OPEN_END_FUND', 'INDEX_FUND', 'FOREIGN_CURRENCY', 'PHYSICAL_COMMODITY', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestmentValuationType" AS ENUM ('MARKET_PRICE', 'NAV', 'FX_RATE', 'ACCRUAL', 'MANUAL');

-- CreateEnum
CREATE TYPE "InvestmentTransactionType" AS ENUM ('BUY', 'SELL', 'OPEN', 'CLOSE');

-- CreateEnum
CREATE TYPE "InvestmentEventType" AS ENUM ('DIVIDEND', 'INTEREST', 'COUPON', 'DISTRIBUTION', 'MATURITY', 'PRINCIPAL_RETURN');

-- CreateTable
CREATE TABLE "InvestmentAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "InvestmentCategory" NOT NULL,
    "instrumentType" "InvestmentInstrumentType" NOT NULL,
    "valuationType" "InvestmentValuationType" NOT NULL,
    "symbol" TEXT,
    "exchange" TEXT,
    "isin" TEXT,
    "issuer" TEXT,
    "underlyingIndex" TEXT,
    "unit" TEXT,
    "pricingUnit" TEXT,
    "marketCurrencyCode" VARCHAR(3),
    "annualInterestRate" DECIMAL(10,6),
    "couponRate" DECIMAL(10,6),
    "faceValue" DECIMAL(18,4),
    "maturityDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "type" "InvestmentTransactionType" NOT NULL,
    "quantity" DECIMAL(30,18),
    "grossAmount" DECIMAL(18,4) NOT NULL,
    "feeAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "currencyCode" VARCHAR(3) NOT NULL,
    "transactedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "type" "InvestmentEventType" NOT NULL,
    "grossAmount" DECIMAL(18,4),
    "feeAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "currencyCode" VARCHAR(3),
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InvestmentAsset_userId_idx" ON "InvestmentAsset"("userId");

-- CreateIndex
CREATE INDEX "InvestmentAsset_category_idx" ON "InvestmentAsset"("category");

-- CreateIndex
CREATE INDEX "InvestmentAsset_symbol_idx" ON "InvestmentAsset"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentAsset_id_userId_key" ON "InvestmentAsset"("id", "userId");

-- CreateIndex
CREATE INDEX "InvestmentTransaction_userId_idx" ON "InvestmentTransaction"("userId");

-- CreateIndex
CREATE INDEX "InvestmentTransaction_assetId_idx" ON "InvestmentTransaction"("assetId");

-- CreateIndex
CREATE INDEX "InvestmentTransaction_transactedAt_idx" ON "InvestmentTransaction"("transactedAt");

-- CreateIndex
CREATE INDEX "InvestmentEvent_userId_idx" ON "InvestmentEvent"("userId");

-- CreateIndex
CREATE INDEX "InvestmentEvent_assetId_idx" ON "InvestmentEvent"("assetId");

-- CreateIndex
CREATE INDEX "InvestmentEvent_occurredAt_idx" ON "InvestmentEvent"("occurredAt");

-- AddForeignKey
ALTER TABLE "InvestmentAsset" ADD CONSTRAINT "InvestmentAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentTransaction" ADD CONSTRAINT "InvestmentTransaction_assetId_userId_fkey" FOREIGN KEY ("assetId", "userId") REFERENCES "InvestmentAsset"("id", "userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentEvent" ADD CONSTRAINT "InvestmentEvent_assetId_userId_fkey" FOREIGN KEY ("assetId", "userId") REFERENCES "InvestmentAsset"("id", "userId") ON DELETE CASCADE ON UPDATE CASCADE;
