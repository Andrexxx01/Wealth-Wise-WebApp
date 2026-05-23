export const INCOME_CATEGORY_VALUES = [
  "SALARY",
  "FREELANCE",
  "BUSINESS",
  "INVESTMENT_RETURN",
  "BONUS",
  "GIFT",
  "OTHER",
] as const;

export const INCOME_FREQUENCY_VALUES = [
  "ONE_TIME",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
] as const;

export const EXPENSE_CATEGORY_VALUES = [
  "HOUSING",
  "FOOD",
  "TRANSPORT",
  "UTILITIES",
  "HEALTH",
  "EDUCATION",
  "SHOPPING",
  "ENTERTAINMENT",
  "SUBSCRIPTION",
  "TRAVEL",
  "OTHER",
] as const;

export const EXPENSE_TYPE_VALUES = ["ESSENTIAL", "LIFESTYLE"] as const;

export const INVESTMENT_CATEGORY_VALUES = [
  "STOCK",
  "CRYPTO",
  "MUTUAL_FUND",
  "BOND",
  "GOLD",
  "PROPERTY",
  "CASH",
  "OTHER",
] as const;

export const LOAN_CATEGORY_VALUES = [
  "PERSONAL",
  "CONSUMER",
  "VEHICLE",
  "MORTGAGE",
  "STUDENT",
  "BUSINESS",
  "OTHER",
] as const;

export const INCOME_CATEGORY_OPTIONS = [
  { value: "SALARY", label: "Salary" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "BUSINESS", label: "Business" },
  { value: "INVESTMENT_RETURN", label: "Investment Return" },
  { value: "BONUS", label: "Bonus" },
  { value: "GIFT", label: "Gift" },
  { value: "OTHER", label: "Other" },
] as const;

export const INCOME_FREQUENCY_OPTIONS = [
  { value: "ONE_TIME", label: "One Time" },
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
] as const;

export const EXPENSE_CATEGORY_OPTIONS = [
  { value: "HOUSING", label: "Housing" },
  { value: "FOOD", label: "Food & Dining" },
  { value: "TRANSPORT", label: "Transportation" },
  { value: "UTILITIES", label: "Utilities" },
  { value: "HEALTH", label: "Health" },
  { value: "EDUCATION", label: "Education" },
  { value: "SHOPPING", label: "Shopping" },
  { value: "ENTERTAINMENT", label: "Entertainment" },
  { value: "SUBSCRIPTION", label: "Subscription" },
  { value: "TRAVEL", label: "Travel" },
  { value: "OTHER", label: "Other" },
] as const;

export const EXPENSE_TYPE_OPTIONS = [
  { value: "ESSENTIAL", label: "Essential" },
  { value: "LIFESTYLE", label: "Lifestyle" },
] as const;

export const INVESTMENT_CATEGORY_OPTIONS = [
  { value: "STOCK", label: "Stock" },
  { value: "CRYPTO", label: "Crypto" },
  { value: "MUTUAL_FUND", label: "Mutual Fund" },
  { value: "BOND", label: "Bond" },
  { value: "GOLD", label: "Gold" },
  { value: "PROPERTY", label: "Property" },
  { value: "CASH", label: "Cash" },
  { value: "OTHER", label: "Other" },
] as const;

export const LOAN_CATEGORY_OPTIONS = [
  { value: "PERSONAL", label: "Personal Loan" },
  { value: "CONSUMER", label: "Consumer Loan" },
  { value: "VEHICLE", label: "Vehicle Loan" },
  { value: "MORTGAGE", label: "Mortgage" },
  { value: "STUDENT", label: "Student Loan" },
  { value: "BUSINESS", label: "Business Loan" },
  { value: "OTHER", label: "Other Loan" },
] as const;
