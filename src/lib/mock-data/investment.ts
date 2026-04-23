import type { InvestmentItem, InvestmentSummary } from "@/types/investment";

export const mockInvestmentSummary: InvestmentSummary = {
  portfolioValue: 12900,
  totalInvested: 11200,
  netGain: 1700,
  monthlyGrowthRate: 4.8,
};

export const mockInvestmentItems: InvestmentItem[] = [
  {
    id: "investment_1",
    userId: "user_1",
    assetName: "Apple Inc.",
    category: "STOCK",
    investedAmount: 2800,
    currentValue: 3100,
    investedAt: "2025-11-12T00:00:00.000Z",
    notes: "Long-term holding",
    createdAt: "2025-11-12T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
  },
  {
    id: "investment_2",
    userId: "user_1",
    assetName: "Bitcoin",
    category: "CRYPTO",
    investedAmount: 1450,
    currentValue: 1650,
    investedAt: "2025-12-08T00:00:00.000Z",
    notes: "High-risk asset",
    createdAt: "2025-12-08T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
  },
  {
    id: "investment_3",
    userId: "user_1",
    assetName: "S&P 500 Index Fund",
    category: "MUTUAL_FUND",
    investedAmount: 1900,
    currentValue: 2100,
    investedAt: "2025-10-14T00:00:00.000Z",
    notes: "Core portfolio position",
    createdAt: "2025-10-14T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
  },
];

export const mockPortfolioAllocation = [
  { name: "Stocks", amount: 6200, percentage: 48 },
  { name: "Crypto", amount: 2300, percentage: 18 },
  { name: "Mutual Funds", amount: 2100, percentage: 16 },
  { name: "Bonds", amount: 1400, percentage: 11 },
  { name: "Cash Reserve", amount: 900, percentage: 7 },
];

export const mockInvestmentPerformanceBars = [
  { month: "Jan", value: 54 },
  { month: "Feb", value: 62 },
  { month: "Mar", value: 58 },
  { month: "Apr", value: 74 },
  { month: "May", value: 80 },
  { month: "Jun", value: 88 },
];
