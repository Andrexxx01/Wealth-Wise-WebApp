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
import { useFinance } from "@/features/finance/components/finance-provider";
import { useFinanceSummary } from "@/features/finance/hooks/use-finance-summary";
import {
  buildExpenseCategoryBreakdown,
  calculateAverageDailySpend,
  sortRecentExpenseItems,
} from "@/lib/finance-calculations";
import { buildExpenseSummaryCards } from "@/lib/finance-summary-cards";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { mockMonthlyExpenseBars } from "@/lib/mock-data/expense";

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

  const { expenseItems, createExpense } = useFinance();

  const { totalExpenses, essentialSpending, lifestyleSpending } =
    useFinanceSummary();

  const averageDailySpend = calculateAverageDailySpend(totalExpenses);

  const expenseSummaryCards = buildExpenseSummaryCards({
    totalExpenses,
    essentialSpending,
    lifestyleSpending,
    averageDailySpend,
  });

  const expenseCategoryBreakdown = buildExpenseCategoryBreakdown({
    expenseItems,
    totalExpenses,
    limit: 5,
  });

  const recentExpenses = sortRecentExpenseItems(expenseItems, 5);

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
              value={card.value}
              helper={card.helper}
              tone={card.tone}
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
        onCreateExpense={createExpense}
      />
    </>
  );
}
