"use client";

import { useState } from "react";
import { BarChartMock } from "@/components/dashboard/bar-chart-mock";
import ChartCard from "@/components/dashboard/chart-card";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import DashboardListItem from "@/components/dashboard/dashboard-list-item";
import SectionHeader from "@/components/dashboard/section-header";
import SummaryCard from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EXPENSE_CATEGORY_OPTIONS } from "@/constants/finance-options";
import AddExpenseDialog from "@/features/expenses/components/add-expense-dialog";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  mockExpenseItems,
  mockMonthlyExpenseBars,
} from "@/lib/mock-data/expense";
import type { CreateExpensePayload } from "@/types/form-payload";
import type { ExpenseCategory, ExpenseItem } from "@/types/expense";

function createTemporaryId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}`;
}

function formatExpenseCategory(category: string) {
  const categoryOption = EXPENSE_CATEGORY_OPTIONS.find(
    (option) => option.value === category,
  );

  return categoryOption?.label ?? category;
}

const monthlyExpenseChartData = mockMonthlyExpenseBars.map((item) => ({
  label: item.month,
  value: item.value,
}));

export default function ExpensesPageClient() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseItems, setExpenseItems] =
    useState<ExpenseItem[]>(mockExpenseItems);

  const totalExpenses = expenseItems.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const essentialSpending = expenseItems
    .filter((item) => item.type === "ESSENTIAL")
    .reduce((total, item) => total + item.amount, 0);

  const lifestyleSpending = expenseItems
    .filter((item) => item.type === "LIFESTYLE")
    .reduce((total, item) => total + item.amount, 0);

  const averageDailySpend = totalExpenses / 30;

  const expenseSummaryCards = [
    {
      label: "Total Expenses",
      value: totalExpenses,
      helper: "This month",
    },
    {
      label: "Essential Spending",
      value: essentialSpending,
      helper: "Needs & fixed costs",
    },
    {
      label: "Lifestyle Spending",
      value: lifestyleSpending,
      helper: "Dining, shopping, fun",
    },
    {
      label: "Average Daily Spend",
      value: averageDailySpend,
      helper: "Based on current month",
    },
  ];

  const expenseCategoryBreakdown = EXPENSE_CATEGORY_OPTIONS.map((option) => {
    const amount = expenseItems
      .filter((item) => item.category === option.value)
      .reduce((total, item) => total + item.amount, 0);

    const percentage =
      totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;

    return {
      name: option.label,
      category: option.value as ExpenseCategory,
      amount,
      percentage,
    };
  })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const recentExpenses = [...expenseItems]
    .sort(
      (a, b) => new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime(),
    )
    .slice(0, 5);

  function handleCreateExpense(payload: CreateExpensePayload) {
    const now = new Date().toISOString();

    const newExpense: ExpenseItem = {
      id: createTemporaryId("expense"),
      userId: "user_1",
      title: payload.title,
      category: payload.category,
      type: payload.type,
      amount: payload.amount,
      spentAt: payload.spentAt,
      notes: payload.notes,
      createdAt: now,
      updatedAt: now,
    };

    setExpenseItems((currentItems) => [newExpense, ...currentItems]);
  }

  return (
    <>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Expense Overview"
          title="Keep your spending under control"
          description="Track daily expenses, understand where your money goes, and build a clearer picture of your financial habits over time."
          action={
            <Button
              type="button"
              onClick={() => setIsAddExpenseOpen(true)}
              className="h-12 rounded-2xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
            >
              Add Expense
            </Button>
          }
        />

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {expenseSummaryCards.map((card) => (
            <SummaryCard
              key={card.label}
              label={card.label}
              value={formatCurrency(card.value)}
              helper={card.helper}
            />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <ChartCard
            eyebrow="Monthly Expense Trend"
            title="Spending Over Time"
            badge="2026"
          >
            <BarChartMock data={monthlyExpenseChartData} />
          </ChartCard>

          <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
            <CardContent className="p-6">
              <DashboardCardHeader
                eyebrow="Category Breakdown"
                title="Top Spending Areas"
              />

              <div className="space-y-4">
                {expenseCategoryBreakdown.map((item) => (
                  <DashboardListItem
                    key={item.category}
                    title={item.name}
                    subtitle={`${item.percentage}% of total expenses`}
                    value={formatCurrency(item.amount)}
                    className="border-none bg-slate-50 p-4"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="rounded-[32px] border-slate-200 bg-white shadow-none">
            <CardContent className="p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <DashboardCardHeader
                  eyebrow="Recent Transactions"
                  title="Latest Expense Activity"
                  className="mb-0"
                />

                <Button
                  variant="outline"
                  className="h-11 rounded-2xl border-slate-300 bg-white px-5 font-semibold text-slate-900 hover:bg-slate-100"
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentExpenses.map((item) => (
                  <DashboardListItem
                    key={item.id}
                    title={item.title}
                    subtitle={formatExpenseCategory(item.category)}
                    value={formatCurrency(item.amount)}
                    meta={formatDate(item.spentAt)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onCreateExpense={handleCreateExpense}
      />
    </>
  );
}
