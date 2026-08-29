import type { InvestmentValuationsResponse } from "@/types/investment-v2";

type ApiErrorResponse = {
  message?: string;
};

export class InvestmentV2ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "InvestmentV2ApiError";
    this.status = status;
  }
}

export async function getInvestmentValuationsV2(): Promise<InvestmentValuationsResponse> {
  const response = await fetch("/api/investments/v2/valuations", {
    method: "GET",

    headers: {
      Accept: "application/json",
    },

    credentials: "include",

    cache: "no-store",
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;

    try {
      errorData = (await response.json()) as ApiErrorResponse;
    } catch {
      errorData = null;
    }

    throw new InvestmentV2ApiError(
      errorData?.message ?? "Failed to load investment valuations.",
      response.status,
    );
  }

  const result = (await response.json()) as InvestmentValuationsResponse;

  return result;
}
