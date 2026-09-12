/*
  Warnings:

  - You are about to drop the `Investment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_userId_fkey";

-- DropTable
DROP TABLE "Investment";
