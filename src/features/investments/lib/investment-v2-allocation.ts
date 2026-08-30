import type {
  InvestmentAssetCategory,
  InvestmentValuationItem,
} from "@/types/investment-v2";

export type InvestmentV2AllocationItem = {
  category: InvestmentAssetCategory;

  name: string;

  marketValue: number;

  percentage: number;
};

function formatInvestmentCategory(category: InvestmentAssetCategory) {
  switch (category) {
    case "CRYPTO":
      return "Crypto";

    case "STOCK":
      return "Stocks";

    case "DEPOSIT":
      return "Deposits";

    case "INDEX":
      return "Index";

    case "BOND":
      return "Bonds";

    case "MUTUAL_FUND":
      return "Mutual Funds";

    case "FOREX":
      return "Forex";

    case "COMMODITY":
      return "Commodities";
  }
}

export function buildInvestmentV2Allocation(
  valuations: InvestmentValuationItem[],
): InvestmentV2AllocationItem[] {
  const marketValueByCategory = new Map<InvestmentAssetCategory, number>();

  for (const valuation of valuations) {
    if (
      valuation.valuationStatus !== "VALUED" ||
      valuation.marketValue === null ||
      valuation.marketValue <= 0
    ) {
      continue;
    }

    const currentMarketValue =
      marketValueByCategory.get(valuation.category) ?? 0;

    marketValueByCategory.set(
      valuation.category,
      currentMarketValue + valuation.marketValue,
    );
  }

  const totalMarketValue = [...marketValueByCategory.values()].reduce(
    (total, marketValue) => total + marketValue,
    0,
  );

  if (totalMarketValue <= 0) {
    return [];
  }

  return [...marketValueByCategory.entries()]
    .map(
      ([category, marketValue]): InvestmentV2AllocationItem => ({
        category,

        name: formatInvestmentCategory(category),

        marketValue,

        percentage: (marketValue / totalMarketValue) * 100,
      }),
    )
    .sort((a, b) => b.marketValue - a.marketValue);
}
