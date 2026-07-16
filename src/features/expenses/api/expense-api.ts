import { requestJson } from "@/lib/api-client";
import type { ApiDataResponse, ApiMessageResponse } from "@/types/api-response";
import type { ExpenseItem } from "@/types/expense";
import type { CreateExpensePayload } from "@/types/form-payload";

export async function getExpenseItems() {
  const response =
    await requestJson<ApiDataResponse<ExpenseItem[]>>("/api/expenses");

  return response.data;
}

export async function createExpenseItem(payload: CreateExpensePayload) {
  const response = await requestJson<ApiDataResponse<ExpenseItem>>(
    "/api/expenses",
    {
      method: "POST",
      body: payload,
    },
  );

  return response.data;
}

export async function updateExpenseItem(
  expenseId: string,
  payload: CreateExpensePayload,
) {
  const response = await requestJson<ApiDataResponse<ExpenseItem>>(
    `/api/expenses/${expenseId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );

  return response.data;
}

export async function deleteExpenseItem(expenseId: string) {
  return requestJson<ApiMessageResponse & { deletedId: string }>(
    `/api/expenses/${expenseId}`,
    {
      method: "DELETE",
    },
  );
}
