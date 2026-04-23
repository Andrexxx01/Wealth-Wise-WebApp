import type { LoanItem, LoanSummary } from "@/types/loan";

export const mockLoanSummary: LoanSummary = {
  totalLoanBalance: 1200,
  monthlyPaymentTotal: 320,
  totalPaidOff: 4800,
  debtToIncomeRatio: 14.6,
};

export const mockLoanItems: LoanItem[] = [
  {
    id: "loan_1",
    userId: "user_1",
    lenderName: "Tech Store",
    title: "Laptop Installment",
    category: "CONSUMER",
    principalAmount: 2000,
    remainingBalance: 650,
    monthlyPayment: 120,
    interestRate: 5.5,
    dueDate: "2026-12-01T00:00:00.000Z",
    status: "ACTIVE",
    createdAt: "2025-08-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
  },
  {
    id: "loan_2",
    userId: "user_1",
    lenderName: "Motor Finance",
    title: "Motorcycle Loan",
    category: "VEHICLE",
    principalAmount: 3500,
    remainingBalance: 420,
    monthlyPayment: 150,
    interestRate: 4.2,
    dueDate: "2026-09-01T00:00:00.000Z",
    status: "ACTIVE",
    createdAt: "2024-12-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
  },
  {
    id: "loan_3",
    userId: "user_1",
    lenderName: "Personal Contact",
    title: "Friend Borrowing",
    category: "PERSONAL",
    principalAmount: 200,
    remainingBalance: 130,
    monthlyPayment: 50,
    interestRate: null,
    dueDate: "2026-06-01T00:00:00.000Z",
    status: "ACTIVE",
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-04-01T00:00:00.000Z",
  },
];

export const mockLoanPayoffBars = [
  { month: "Jan", value: 22 },
  { month: "Feb", value: 34 },
  { month: "Mar", value: 46 },
  { month: "Apr", value: 58 },
  { month: "May", value: 70 },
  { month: "Jun", value: 82 },
];
