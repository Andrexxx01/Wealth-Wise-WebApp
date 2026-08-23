/*
  Warnings:

  - Made the column `quantity` on table `Investment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `symbol` on table `Investment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Investment" ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "symbol" SET NOT NULL;
