-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';
