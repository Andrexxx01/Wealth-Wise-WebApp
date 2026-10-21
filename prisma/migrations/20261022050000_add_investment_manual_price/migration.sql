-- Add optional manual current price metadata for MANUAL investment valuation.
ALTER TABLE "InvestmentAsset"
ADD COLUMN "manualPrice" DECIMAL(30,12),
ADD COLUMN "manualPriceUpdatedAt" TIMESTAMP(3);
