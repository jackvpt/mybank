// 🔄 React Query
import { useQuery, keepPreviousData } from "@tanstack/react-query"

// 🔌 API calls
import {
  getAllRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  deleteRecurringTransactions,
} from "../api/recurringTransactions.api"

// 🧬 Models
import RecurringTransactionModel from "../models/RecurringTransactionModel"

// 🔔 Shared mutation wrapper (notifications + cache invalidation)
import { useMutationWithNotification } from "./NotificationProvider/useMutationWithNotification"

// ⏱️ Query cache config
const STALE_TIME = 10 * 60 * 1000 // Time before data is considered stale (no longer fresh)
const REFETCH_INTERVAL = 10 * 60 * 1000 // Time between automatic refetches (while the query is active)

const DEFAULT_QUERY_OPTIONS = {
  staleTime: STALE_TIME,
  refetchInterval: REFETCH_INTERVAL,

  // v5 replacement for `keepPreviousData: true`: keeps showing the
  // last successful data while a refetch is in flight, instead of
  // flashing a loading state.
  placeholderData: keepPreviousData,
}

/**
 * Shared query function for every "recurringTransactions" query.
 * The API layer returns raw data; model conversion lives here so that
 * all consumers receive domain objects (RecurringTransactionModel instances).
 */
const fetchRecurringTransactions = async () => {
  const recurringTransactions = await getAllRecurringTransactions()
  return recurringTransactions.map(
    (recurringTransaction) =>
      new RecurringTransactionModel(recurringTransaction),
  )
}

/**
 * Domain-specific wrapper around the shared mutation hook.
 * Every recurring transaction mutation invalidates the
 * ["recurringTransactions"] query on settle (prefix matching also
 * covers any sub-keys).
 *
 * Notifications can be skipped per call by passing `silent: true` in the
 * mutation variables, e.g. `updateRecurringTransaction({ id, updatedData, silent: true })`.
 */
const useRecurringTransactionMutation = (config) =>
  useMutationWithNotification({
    invalidateKeys: [["recurringTransactions"]],
    ...config,
  })

// ----------------------------
// Get all recurring transactions
// ----------------------------
export const useGetAllRecurringTransactions = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["recurringTransactions"],
    queryFn: fetchRecurringTransactions,
    enabled,

    ...DEFAULT_QUERY_OPTIONS,
  })
}

// ----------------------------
// Get recurring transactions by account name
// ----------------------------
// Shares the same cache entry as `useGetAllRecurringTransactions`: only one
// network request is made, and `select` filters the cached data client-side.
export const useGetRecurringTransactionsByAccountName = (
  accountName,
  { enabled = true } = {},
) => {
  return useQuery({
    queryKey: ["recurringTransactions"],
    queryFn: fetchRecurringTransactions,
    select: (recurringTransactions) =>
      recurringTransactions.filter(
        (recurringTransaction) =>
          recurringTransaction.accountName === accountName,
      ),

    // Avoids firing with an empty/undefined accountName.
    enabled: enabled && !!accountName,

    ...DEFAULT_QUERY_OPTIONS,
  })
}

// ----------------------------
// Get recurring transactions by account ID
// ----------------------------
// Same approach as above: shared cache entry + client-side filtering.
export const useGetRecurringTransactionsByAccountId = (
  accountId,
  { enabled = true } = {},
) => {
  return useQuery({
    queryKey: ["recurringTransactions"],
    queryFn: fetchRecurringTransactions,
    select: (recurringTransactions) =>
      recurringTransactions.filter(
        (recurringTransaction) => recurringTransaction.accountId === accountId,
      ),

    // Avoids firing with an empty/undefined accountId.
    enabled: enabled && !!accountId,

    ...DEFAULT_QUERY_OPTIONS,
  })
}

// ----------------------------
// Create a new recurring transaction
// ----------------------------
export const useCreateRecurringTransaction = () =>
  useRecurringTransactionMutation({
    mutationFn: async (recurringTransactionData) => {
      const created = await createRecurringTransaction(
        recurringTransactionData,
      )
      return new RecurringTransactionModel(created)
    },
    successMessage: "Transaction récurrente ajoutée",
    errorMessage: "Erreur lors de la création",
  })

// ----------------------------
// Update an existing recurring transaction
// ----------------------------
export const useUpdateRecurringTransaction = () =>
  useRecurringTransactionMutation({
    // Destructuring keeps extra variables (like `silent`) out of the API call.
    mutationFn: async ({ id, updatedData }) => {
      const updated = await updateRecurringTransaction({ id, updatedData })
      return new RecurringTransactionModel(updated)
    },
    successMessage: "Transaction récurrente mise à jour",
    errorMessage: "Erreur lors de la mise à jour",
  })

// ----------------------------
// Delete a single recurring transaction
// ----------------------------
export const useDeleteRecurringTransaction = () =>
  useRecurringTransactionMutation({
    mutationFn: deleteRecurringTransaction,
    successMessage: "Transaction récurrente supprimée",
    errorMessage: "Erreur lors de la suppression",
  })

// ----------------------------
// Bulk delete recurring transactions
// ----------------------------
export const useDeleteRecurringTransactions = () =>
  useRecurringTransactionMutation({
    mutationFn: deleteRecurringTransactions,
    successMessage: "Transactions récurrentes supprimées",
    errorMessage: "Erreur lors de la suppression",
  })