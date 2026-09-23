// 🔄 React Query
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query"

// 🔌 API calls
import {
  getAllTransactions,
  getTransactionsByAccountName,
  getTransactionsByAccountId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteTransactions,
  validateTransactions,
} from "../api/transactions.api"

// 🧬 Models
import TransactionModel from "../models/TransactionModel"

// 🔔 Notifications
import { useNotification } from "./NotificationProvider/useNotification"

/**
 * Invalidates the "transactions" query, forcing a
 * refetch on next access. Centralized here so every mutation stays
 * consistent.
 */
const invalidateData = (client) => {
  client.invalidateQueries({ queryKey: ["transactions"] })
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
// Get all transactions
// ----------------------------
export const useGetTransactions = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const transactions = await getAllTransactions()
      // Model conversion lives here: the API layer returns raw data,
      // this hook is responsible for turning it into domain objects.
      return transactions.map((transaction) => new TransactionModel(transaction))
    },

    enabled,

    // v5 replacement for `keepPreviousData: true`: keeps showing the
    // last successful data while a refetch is in flight, instead of
    // flashing a loading state.
    placeholderData: keepPreviousData,

    staleTime: 10000 * 60, // 10 minutes
    refetchInterval: 600000, // poll every 10 minutes — matches staleTime above
  })
}

// ----------------------------
// Get transactions by account name
// ----------------------------
export const useGetTransactionsByAccountName = (accountName, { enabled = true } = {}) => {
  return useQuery({
    queryKey: ["transactions", "byAccountName", accountName],
    queryFn: async () => {
      const transactions = await getTransactionsByAccountName(accountName)
      return transactions.map((transaction) => new TransactionModel(transaction))
    },

    // Avoids firing with an empty/undefined accountName.
    enabled: enabled && !!accountName,

    placeholderData: keepPreviousData,
    staleTime: 10000 * 60,
  })
}

// ----------------------------
// Get transactions by account ID
// ----------------------------
export const useGetTransactionsByAccountId = (accountId, { enabled = true } = {}) => {
  return useQuery({
    queryKey: ["transactions", "byAccountId", accountId],
    queryFn: async () => {
      const transactions = await getTransactionsByAccountId(accountId)
      return transactions.map((transaction) => new TransactionModel(transaction))
    },

    enabled: enabled && !!accountId,

    placeholderData: keepPreviousData,
    staleTime: 10000 * 60,
  })
}

// ----------------------------
// Create a new transaction
// ----------------------------
export const useCreateTransaction = () =>
  useMutationWithNotification({
    mutationFn: async (transactionData) => {
      const created = await createTransaction(transactionData)
      return new TransactionModel(created)
    },
    successMessage: "Transaction ajoutée",
    errorMessage: "Erreur lors de la création",
  })

// ----------------------------
// Update an existing transaction
// ----------------------------
export const useUpdateTransaction = () =>
  useMutationWithNotification({
    mutationFn: async ({ id, updatedData }) => {
      const updated = await updateTransaction({ id, updatedData })
      return new TransactionModel(updated)
    },
    successMessage: "Transaction mise à jour",
    errorMessage: "Erreur lors de la mise à jour",
  })

// ----------------------------
// Delete a single transaction
// ----------------------------
export const useDeleteTransaction = () =>
  useMutationWithNotification({
    mutationFn: deleteTransaction,
    successMessage: "Transaction supprimée",
    errorMessage: "Erreur lors de la suppression",
  })

// ----------------------------
// Bulk delete transactions
// ----------------------------
export const useDeleteTransactions = () =>
  useMutationWithNotification({
    mutationFn: deleteTransactions,
    successMessage: "Transactions supprimées",
    errorMessage: "Erreur lors de la suppression",
  })

// ----------------------------
// Validate transactions
// ----------------------------
export const useValidateTransactions = () =>
  useMutationWithNotification({
    mutationFn: validateTransactions,
    successMessage: "Transactions validées",
    errorMessage: "Erreur lors de la validation",
  })