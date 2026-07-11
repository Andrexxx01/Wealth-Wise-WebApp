type SerializableInvestment = {
  id: string;
  assetName: string;
  category: string;
  investedAmount: unknown;
  currentValue: unknown;
  investedAt: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeInvestment(investment: SerializableInvestment) {
  return {
    id: investment.id,
    assetName: investment.assetName,
    category: investment.category,
    investedAmount: Number(investment.investedAmount),
    currentValue: Number(investment.currentValue),
    investedAt: investment.investedAt.toISOString().slice(0, 10),
    notes: investment.notes ?? "",
    createdAt: investment.createdAt.toISOString(),
    updatedAt: investment.updatedAt.toISOString(),
  };
}
