type SerializableExpense = {
  id: string;
  title: string;
  category: string;
  type: string;
  amount: unknown;
  spentAt: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeExpense(expense: SerializableExpense) {
  return {
    id: expense.id,
    title: expense.title,
    category: expense.category,
    type: expense.type,
    amount: Number(expense.amount),
    spentAt: expense.spentAt.toISOString().slice(0, 10),
    notes: expense.notes ?? "",
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
  };
}
