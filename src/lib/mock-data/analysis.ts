import type { AnalysisSummary } from "@/types/analysis";

export const mockAnalysisSummary: AnalysisSummary = {
  healthScore: {
    score: 82,
    label: "Excellent Progress",
    summary: "Your financial condition looks strong overall this month.",
  },
  healthMetrics: [
    {
      label: "Savings Rate",
      value: "34%",
      helper: "Healthy and consistent",
    },
    {
      label: "Debt-to-Income Ratio",
      value: "14.6%",
      helper: "Still in a safe zone",
    },
    {
      label: "Investment Allocation",
      value: "48%",
      helper: "Good growth exposure",
    },
    {
      label: "Expense Load",
      value: "42%",
      helper: "Below income threshold",
    },
  ],
  monthlyReview: [
    {
      title: "Cash Flow Health",
      value: "Positive",
      helper: "Income remains higher than monthly spending",
    },
    {
      title: "Spending Discipline",
      value: "Moderate",
      helper: "Lifestyle categories increased this month",
    },
    {
      title: "Debt Pressure",
      value: "Low",
      helper: "Loan burden is still well-managed",
    },
    {
      title: "Investment Momentum",
      value: "Good",
      helper: "Portfolio continues to grow month by month",
    },
  ],
  insights: [
    {
      id: "insight_1",
      title: "Strong savings behavior",
      description:
        "Your current savings rate is above a healthy baseline, which gives you room to grow investments and handle emergencies better.",
      tone: "positive",
    },
    {
      id: "insight_2",
      title: "Debt remains manageable",
      description:
        "Your debt-to-income ratio is still under control, which means your current loan commitments are not putting too much pressure on your cash flow.",
      tone: "positive",
    },
    {
      id: "insight_3",
      title: "Lifestyle spending should be watched",
      description:
        "Dining, shopping, and entertainment are rising faster than essential spending.",
      tone: "warning",
    },
    {
      id: "insight_4",
      title: "Portfolio growth is promising",
      description:
        "Your investments are growing steadily, but your portfolio is still concentrated in a few categories.",
      tone: "neutral",
    },
  ],
  recommendedActions: [
    {
      id: "action_1",
      title: "Maintain savings momentum",
      description: "Keep your savings rate above 30% for the next 3 months.",
    },
    {
      id: "action_2",
      title: "Reduce flexible spending",
      description:
        "Reduce lifestyle expenses by 8% to improve monthly surplus.",
    },
    {
      id: "action_3",
      title: "Stay consistent on debt",
      description: "Maintain on-time loan payments to keep debt pressure low.",
    },
    {
      id: "action_4",
      title: "Diversify portfolio",
      description: "Review allocation and add more diversification over time.",
    },
  ],
};
