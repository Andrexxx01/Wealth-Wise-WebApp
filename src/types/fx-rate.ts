export type FxRatesByCurrency = Record<string, number>;

export type UsdFxRateTableData = {
  base: "USD";
  rates: FxRatesByCurrency;
  asOf: string | null;
};
