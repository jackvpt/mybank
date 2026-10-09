// 🪝 Hooks
import { useGetAllBankAccounts } from "./useBankAccounts"
import { useGetAllTransactions } from "./useTransactions"
import { useGetAllRecurringTransactions } from "./useRecurringTransactions"
import { useGetAllSettings } from "./useSettings"
import { useGetAllCategories } from "./useCategories"

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
  const accounts = useGetAllBankAccounts({ enabled })
  const transactions = useGetAllTransactions({ enabled })
  const recurringTransactions = useGetAllRecurringTransactions({ enabled })

  useGetAllSettings({ enabled })
  useGetAllCategories({ enabled })

  return { accounts, transactions, recurringTransactions }
}
