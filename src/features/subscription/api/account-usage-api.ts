import { requestJson } from "@/lib/api-client";
import type { AccountUsageData } from "@/types/account-usage";
import type { ApiDataResponse } from "@/types/api-response";

export async function getAccountUsage() {
  const response =
    await requestJson<ApiDataResponse<AccountUsageData>>("/api/account/usage");

  return response.data;
}
