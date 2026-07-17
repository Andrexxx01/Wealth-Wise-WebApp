import { requestJson } from "@/lib/api-client";
import type { ApiDataResponse, ApiMessageResponse } from "@/types/api-response";
import type { CreateInvestmentPayload } from "@/types/form-payload";
import type { InvestmentItem } from "@/types/investment";

export async function getInvestmentItems() {
  const response =
    await requestJson<ApiDataResponse<InvestmentItem[]>>("/api/investments");

  return response.data;
}

export async function createInvestmentItem(payload: CreateInvestmentPayload) {
  const response = await requestJson<ApiDataResponse<InvestmentItem>>(
    "/api/investments",
    {
      method: "POST",
      body: payload,
    },
  );

  return response.data;
}

export async function updateInvestmentItem(
  investmentId: string,
  payload: CreateInvestmentPayload,
) {
  const response = await requestJson<ApiDataResponse<InvestmentItem>>(
    `/api/investments/${investmentId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );

  return response.data;
}

export async function deleteInvestmentItem(investmentId: string) {
  return requestJson<ApiMessageResponse & { deletedId: string }>(
    `/api/investments/${investmentId}`,
    {
      method: "DELETE",
    },
  );
}
