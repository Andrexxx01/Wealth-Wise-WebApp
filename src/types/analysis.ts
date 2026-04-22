export type InsightTone = "positive" | "warning" | "neutral";

export interface FinancialHealthScore {
  score: number;
  label: string;
  summary: string;
}

export interface HealthMetric {
  label: string;
  value: number | string;
  helper: string;
}

export interface FinancialInsight {
  id: string;
  title: string;
  description: string;
  tone: InsightTone;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
}

export interface MonthlyReviewItem {
  title: string;
  value: string;
  helper: string;
}

export interface AnalysisSummary {
  healthScore: FinancialHealthScore;
  healthMetrics: HealthMetric[];
  monthlyReview: MonthlyReviewItem[];
  insights: FinancialInsight[];
  recommendedActions: RecommendedAction[];
}
