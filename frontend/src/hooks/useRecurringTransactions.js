// 🔄 React Query
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query"

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

// 🔔 Notifications
import { useNotification } from "./NotificationProvider/useNotification"

// ⏱️ Query cache config
const STALE_TIME = 10 * 60 * 1000 // Time before data is considered stale (no more fresh)
const REFETCH_INTERVAL = 10 * 60 * 1000 // Time between automatic refetches (if the query is active in the viewport)

const DEFAULT_QUERY_OPTIONS = {
  staleTime: STALE_TIME,
  refetchInterval: REFETCH_INTERVAL,

  // v5 replacement for `keepPreviousData: true`: keeps showing the
  // last successful data while a refetch is in flight, instead of
  // flashing a loading state.
  placeholderData: keepPreviousData,
}

/**
 * Invalidates the "transactions" query, forcing a
 * refetch on next access. Centralized here so every mutation stays
 * consistent.
 */
const invalidateData = (client) => {
  client.invalidateQueries({ queryKey: ["recurringTransactions"] })
}

/**
 * useMutationWithNotification
 * ------------------------------------------------------------------
 * Wraps `useMutation` with three cross-cutting concerns so individual
 * hooks below don't have to repeat them:
 *
 * 1. Success notification (static string or a function of `data`).
 * 2. Error notification (falls back to a generic message).
 * 3. Automatic cache invalidation of data on
 *    settle, unless the caller explicitly opts out with `invalidate: false`.
 *
 * Any `onSuccess` / `onError` / `onSettled` passed in `config` still
 * runs — this wrapper calls them *after* its own logic.
 */
const useMutationWithNotification = (config) => {
  const queryClient = useQueryClient()
  const { notifySuccess, notifyError } = useNotification()

  return useMutation({
    ...config,

    onSuccess: (data, variables, context) => {
      if (config.successMessage) {
        notifySuccess(
          typeof config.successMessage === "function"
            ? config.successMessage(data)
            : config.successMessage,
        )
      }

      config.onSuccess?.(data, variables, context)
    },

    onError: (error, variables, context) => {
      const message =
        error?.message || config.errorMessage || "Une erreur est survenue"

      notifyError(message)
      config.onError?.(error, variables, context)
    },

    onSettled: (data, error, variables, context) => {
      if (config.invalidate !== false) {
        invalidateData(queryClient)
      }

      config.onSettled?.(data, error, variables, context)
    },
  })
}

// ----------------------------
// Get all recurring transactions
// ----------------------------
export const useGetAllRecurringTransactions = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["recurringTransactions"],
    queryFn: async () => {
      const recurringTransactions = await getAllRecurringTransactions()
      // Model conversion lives here: the API layer returns raw data,
      // this hook is responsible for turning it into domain objects.
      return recurringTransactions.map(
        (recurringTransaction) =>
          new RecurringTransactionModel(recurringTransaction),
      )
    },

    enabled,

    ...DEFAULT_QUERY_OPTIONS,
  })
}

// ----------------------------
// Get recurring transactions by account name
// ----------------------------
export const useGetRecurringTransactionsByAccountName = (
  accountName,
  { enabled = true } = {},
) => {
  return useQuery({
    queryKey: ["recurringTransactions", "byAccountName", accountName],
    queryFn: async () => {
      const allRecurringTransactions = await getAllRecurringTransactions()
      return allRecurringTransactions
        .filter(
          (recurringTransaction) =>
            recurringTransaction.accountName === accountName,
        )
        .map(
          (recurringTransaction) =>
            new RecurringTransactionModel(recurringTransaction),
        )
    },

    // Avoids firing with an empty/undefined accountName.
    enabled: enabled && !!accountName,

    ...DEFAULT_QUERY_OPTIONS,
  })
}

// ----------------------------
// Get recurring transactions by account ID
// ----------------------------
export const useGetRecurringTransactionsByAccountId = (
  accountId,
  { enabled = true } = {},
) => {
  return useQuery({
    queryKey: ["recurringTransactions", "byAccountId", accountId],
    queryFn: async () => {
      const allRecurringTransactions = await getAllRecurringTransactions()
      return allRecurringTransactions
        .filter(
          (recurringTransaction) =>
            recurringTransaction.accountId === accountId,
        )
        .map(
          (recurringTransaction) =>
            new RecurringTransactionModel(recurringTransaction),
        )
    },

    enabled: enabled && !!accountId,

    ...DEFAULT_QUERY_OPTIONS,
  })
}

// ----------------------------
// Create a new recurring transaction
// ----------------------------
export const useCreateRecurringTransaction = () =>
  useMutationWithNotification({
    mutationFn: async (transactionData) => {
      const created = await createRecurringTransaction(transactionData)
      return new RecurringTransactionModel(created)
    },
    successMessage: "Transaction récurrente ajoutée",
    errorMessage: "Erreur lors de la création",
  })

// ----------------------------
// Update an existing recurring transaction
// ----------------------------
export const useUpdateRecurringTransaction = () =>
  useMutationWithNotification({
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
  useMutationWithNotification({
    mutationFn: deleteRecurringTransaction,
    successMessage: "Transaction récurrente supprimée",
    errorMessage: "Erreur lors de la suppression",
  })

// ----------------------------
// Bulk delete recurring transactions
// ----------------------------
export const useDeleteRecurringTransactions = () =>
  useMutationWithNotification({
    mutationFn: deleteRecurringTransactions,
    successMessage: "Transactions récurrentes supprimées",
    errorMessage: "Erreur lors de la suppression",
  })
