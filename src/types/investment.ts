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
  category: InvestmentCategory;
  investedAmount: number;
  currentValue: number;
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
  category: InvestmentCategory;
  investedAmount: string;
  currentValue: string;
  currency: UserCurrency;
  investedAt: string;
  notes?: string;
};
