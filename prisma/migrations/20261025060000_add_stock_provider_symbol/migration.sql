-- Separate the user-facing stock ticker from the market-data provider symbol.
ALTER TABLE "InvestmentAsset"
ADD COLUMN "providerSymbol" TEXT;

CREATE INDEX "InvestmentAsset_providerSymbol_idx"
ON "InvestmentAsset"("providerSymbol");
