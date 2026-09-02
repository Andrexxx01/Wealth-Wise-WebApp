import type {
  CreateInvestmentAssetV2Payload,
  CreateInvestmentTransactionV2Payload,
  InvestmentAssetWithTransactionsItem,
  InvestmentRecentTransactionsV2Response,
  InvestmentTransactionItem,
  InvestmentValuationsResponse,
} from "@/types/investment-v2";

type ApiErrorResponse = {
  message?: string;

  errors?: unknown;

  code?: string;

  data?: unknown;
};

export class InvestmentV2ApiError extends Error {
  status: number;

  code: string | null;
  errors: unknown;
  data: unknown;

  constructor({
    message,
    status,
    code = null,
    errors = null,
    data = null,
  }: {
    message: string;
    status: number;
    code?: string | null;
    errors?: unknown;
    data?: unknown;
  }) {
    super(message);

    this.name = "InvestmentV2ApiError";

    this.status = status;
    this.code = code;
    this.errors = errors;
    this.data = data;
  }
}

async function throwInvestmentV2ApiError(
  response: Response,
  fallbackMessage: string,
): Promise<never> {
  let errorData: ApiErrorResponse | null = null;

  try {
    errorData = (await response.json()) as ApiErrorResponse;
  } catch {
    errorData = null;
  }

  throw new InvestmentV2ApiError({
    message: errorData?.message ?? fallbackMessage,

    status: response.status,

    code: errorData?.code ?? null,

    errors: errorData?.errors ?? null,

    data: errorData?.data ?? null,
  });
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
    return throwInvestmentV2ApiError(
      response,
      "Failed to load investment valuations.",
    );
  }

  const result = (await response.json()) as InvestmentValuationsResponse;

  return result;
}

export async function getInvestmentRecentTransactionsV2(): Promise<InvestmentRecentTransactionsV2Response> {
  const response = await fetch("/api/investments/v2/transactions", {
    method: "GET",

    headers: {
      Accept: "application/json",
    },

    credentials: "include",

    cache: "no-store",
  });

  if (!response.ok) {
    return throwInvestmentV2ApiError(
      response,
      "Failed to load investment transactions.",
    );
  }

  return (await response.json()) as InvestmentRecentTransactionsV2Response;
}

export async function createInvestmentAssetV2(
  payload: CreateInvestmentAssetV2Payload,
): Promise<InvestmentAssetWithTransactionsItem> {
  const response = await fetch("/api/investments/v2", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    credentials: "include",

    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return throwInvestmentV2ApiError(
      response,
      "Failed to create investment asset.",
    );
  }

  const result = (await response.json()) as {
    data: InvestmentAssetWithTransactionsItem;
  };

  return result.data;
}

export async function createInvestmentTransactionV2(
  assetId: string,
  payload: CreateInvestmentTransactionV2Payload,
): Promise<InvestmentTransactionItem> {
  const response = await fetch(
    `/api/investments/v2/${encodeURIComponent(assetId)}/transactions`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      credentials: "include",

      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    return throwInvestmentV2ApiError(
      response,
      "Failed to create investment transaction.",
    );
  }

  const result = (await response.json()) as {
    data: InvestmentTransactionItem;
  };

  return result.data;
}
