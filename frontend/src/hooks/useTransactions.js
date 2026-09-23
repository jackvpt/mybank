// 🔄 React Query
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query"

// 🔌 API calls
import { getAllTransactions, createTransaction } from "../api/transactions.api"

// 🧬 Models
import TransactionModel from "../models/TransactionModel"

// 🔔 Notifications
import { useNotification } from "./NotificationProvider/useNotification"

/**
 * Invalidates the "accounts" query, forcing a refetch on next access.
 * Centralized here so every mutation stays consistent.
 */
const invalidateAccounts = (client) =>
  client.invalidateQueries({ queryKey: ["accounts"] })

/**
 * useMutationWithNotification
 * ------------------------------------------------------------------
 * Wraps `useMutation` with three cross-cutting concerns so individual
 * hooks below don't have to repeat them:
 *
 * 1. Success notification (static string or a function of `data`).
 * 2. Error notification (falls back to a generic message).
 * 3. Automatic cache invalidation of "accounts" on settle, unless the
 *    caller explicitly opts out with `invalidate: false`.
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
      console.error("useMutationWithNotification error:", config) // 👈 temporaire, pour debug

      const message =
        error?.message || config.errorMessage || "Une erreur est survenue"

      notifyError(message)
      config.onError?.(error, variables, context)
    },

    onSettled: (data, error, variables, context) => {
      if (config.invalidate !== false) {
        invalidateAccounts(queryClient)
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

      // Normalize every entry into an TransactionModel instance, even if
      // the API already returns model instances (defensive — avoids
      // double-wrapping while still guaranteeing the shape downstream).
      return transactions.map((transaction) =>
        transaction instanceof TransactionModel
          ? transaction
          : new TransactionModel(transaction),
      )
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
// Create a new transaction
// ----------------------------
export const useCreateTransaction = () =>
  useMutationWithNotification({
    mutationFn: createTransaction,
    successMessage: "Transaction ajoutée",
    errorMessage: "Erreur lors de la création",
  })
