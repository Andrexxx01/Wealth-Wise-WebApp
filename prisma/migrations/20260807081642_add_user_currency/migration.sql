-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'IDR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';
