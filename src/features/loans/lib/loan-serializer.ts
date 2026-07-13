type SerializableLoan = {
  id: string;
  title: string;
  lenderName: string;
  category: string;
  principalAmount: unknown;
  remainingBalance: unknown;
  monthlyPayment: unknown;
  interestRate: unknown | null;
  dueDate: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeLoan(loan: SerializableLoan) {
  return {
    id: loan.id,
    title: loan.title,
    lenderName: loan.lenderName,
    category: loan.category,
    principalAmount: Number(loan.principalAmount),
    remainingBalance: Number(loan.remainingBalance),
    monthlyPayment: Number(loan.monthlyPayment),
    interestRate: loan.interestRate === null ? null : Number(loan.interestRate),
    dueDate: loan.dueDate ? loan.dueDate.toISOString().slice(0, 10) : null,
    status: loan.status,
    createdAt: loan.createdAt.toISOString(),
    updatedAt: loan.updatedAt.toISOString(),
  };
}
