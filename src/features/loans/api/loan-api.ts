import { requestJson } from "@/lib/api-client";
import type { ApiDataResponse, ApiMessageResponse } from "@/types/api-response";
import type { CreateLoanPayload } from "@/types/form-payload";
import type { LoanItem } from "@/types/loan";

export async function getLoanItems() {
  const response = await requestJson<ApiDataResponse<LoanItem[]>>("/api/loans");

  return response.data;
}

export async function createLoanItem(payload: CreateLoanPayload) {
  const response = await requestJson<ApiDataResponse<LoanItem>>("/api/loans", {
    method: "POST",
    body: payload,
  });

  return response.data;
}

export async function updateLoanItem(
  loanId: string,
  payload: CreateLoanPayload,
) {
  const response = await requestJson<ApiDataResponse<LoanItem>>(
    `/api/loans/${loanId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );

  return response.data;
}

export async function deleteLoanItem(loanId: string) {
  return requestJson<ApiMessageResponse & { deletedId: string }>(
    `/api/loans/${loanId}`,
    {
      method: "DELETE",
    },
  );
}
