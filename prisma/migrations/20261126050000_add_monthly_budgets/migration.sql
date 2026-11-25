CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" VARCHAR(7) NOT NULL,
    "category" VARCHAR(32) NOT NULL,
    "currency" "Currency" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Budget_positive_amount" CHECK ("amount" > 0)
);
CREATE UNIQUE INDEX "Budget_userId_month_category_currency_key" ON "Budget"("userId", "month", "category", "currency");
CREATE INDEX "Budget_userId_month_idx" ON "Budget"("userId", "month");
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
