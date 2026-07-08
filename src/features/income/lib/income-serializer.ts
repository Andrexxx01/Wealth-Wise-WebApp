type SerializableIncome = {
  id: string;
  title: string;
  category: string;
  amount: unknown;
  receivedAt: Date;
  frequency: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeIncome(income: SerializableIncome) {
  return {
    id: income.id,
    title: income.title,
    category: income.category,
    amount: Number(income.amount),
    receivedAt: income.receivedAt.toISOString().slice(0, 10),
    frequency: income.frequency,
    notes: income.notes ?? "",
    createdAt: income.createdAt.toISOString(),
    updatedAt: income.updatedAt.toISOString(),
  };
}
