import type { UserCurrency } from "@/types/user-subscription";

export type InvestmentCategory =
  | "STOCK"
  | "CRYPTO"
  | "MUTUAL_FUND"
  | "BOND"
  | "GOLD"
  | "PROPERTY"
  | "CASH"
  | "OTHER";

export interface InvestmentItem {
  id: string;
  userId: string;

  assetName: string;
  symbol: string | null;
  category: InvestmentCategory;

  investedAmount: number;
  quantity: number | null;
  feeAmount: number;
  currency: UserCurrency;

  investedAt: string;
  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface InvestmentSummary {
  portfolioValue: number;
  totalInvested: number;
  netGain: number;
  monthlyGrowthRate: number;
}

export type CreateInvestmentFormValues = {
  assetName: string;
  symbol: string;
  category: InvestmentCategory;

  investedAmount: string;
  quantity: string;
  feeAmount: string;

  currency: UserCurrency;
  investedAt: string;
  notes?: string;
};
