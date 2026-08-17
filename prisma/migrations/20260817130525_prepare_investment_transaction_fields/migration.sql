-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "feeAmount" DECIMAL(12,4) NOT NULL DEFAULT 0,
ADD COLUMN     "quantity" DECIMAL(30,18),
ADD COLUMN     "symbol" TEXT;
