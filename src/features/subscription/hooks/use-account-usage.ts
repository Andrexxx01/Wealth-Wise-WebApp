"use client";

import { useCallback, useEffect, useState } from "react";
import { getAccountUsage } from "@/features/subscription/api/account-usage-api";
import type { AccountUsageData } from "@/types/account-usage";

type UseAccountUsageResult = {
  accountUsage: AccountUsageData | null;
  isLoading: boolean;
  error: string | null;
  reloadAccountUsage: () => Promise<void>;
};

export function useAccountUsage(): UseAccountUsageResult {
  const [accountUsage, setAccountUsage] = useState<AccountUsageData | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadAccountUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getAccountUsage();

      setAccountUsage(data);
    } catch (error) {
      console.error("Failed to load account usage:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load account usage.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadAccountUsage();
  }, [reloadAccountUsage]);

  return {
    accountUsage,
    isLoading,
    error,
    reloadAccountUsage,
  };
}
