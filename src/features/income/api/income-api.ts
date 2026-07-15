import { requestJson } from "@/lib/api-client";
import type { ApiDataResponse, ApiMessageResponse } from "@/types/api-response";
import type { CreateIncomePayload } from "@/types/form-payload";
import type { IncomeItem } from "@/types/income";

export async function getIncomeItems() {
  const response =
    await requestJson<ApiDataResponse<IncomeItem[]>>("/api/income");

  return response.data;
}

export async function createIncomeItem(payload: CreateIncomePayload) {
  const response = await requestJson<ApiDataResponse<IncomeItem>>(
    "/api/income",
    {
      method: "POST",
      body: payload,
    },
  );

  return response.data;
}

export async function updateIncomeItem(
  incomeId: string,
  payload: CreateIncomePayload,
) {
  const response = await requestJson<ApiDataResponse<IncomeItem>>(
    `/api/income/${incomeId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );

  return response.data;
}

export async function deleteIncomeItem(incomeId: string) {
  return requestJson<ApiMessageResponse & { deletedId: string }>(
    `/api/income/${incomeId}`,
    {
      method: "DELETE",
    },
  );
}
