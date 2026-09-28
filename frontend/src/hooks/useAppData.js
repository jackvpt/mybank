// src/hooks/useAppData.js

// 🔄 React Query
import { useQuery } from "@tanstack/react-query"

// 🪝 Hooks
import { useGetBankAccounts } from "./useBankAccounts"
import { useGetAllTransactions } from "./useTransactions"
import { useGetSettings } from "./useSettings"
import { useGetAllCategories } from "./useCategories"

// 🌐 API
import { fetchAllRecurringTransactions } from "../api/recurringTransactions"

/**
 * useAppData
 * ------------------------------------------------------------------
 * Centralizes every data fetch AppInitializer depends on.
 *
 * - accounts / transactions: BLOCKING — their loading/error state is
 *   returned so the caller can gate rendering on them.
 * - settings / categories / recurringTransactions: non-blocking
 *   prefetch, just warms the cache, no state returned.
 *
 * `enabled` should reflect confirmed auth — none of these should
 * fire with an unconfirmed/invalid token.
 */
export const useAppData = ({ enabled = true } = {}) => {
  const accounts = useGetBankAccounts({ enabled })
  const transactions = useGetAllTransactions({ enabled })

  useQuery({
    queryKey: ["recurringTransactions"],
    queryFn: fetchAllRecurringTransactions,
    enabled,
  })

  useGetSettings({ enabled })
  useGetAllCategories({ enabled })

  return { accounts, transactions }
}