// 🔄 React Query
import { useQuery, keepPreviousData } from "@tanstack/react-query"

// 🔌 API calls
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteTransactions,
  validateTransactions,
  updateTransactionsStatus,
} from "../api/transactions.api"

// 🧬 Models
import TransactionModel from "../models/TransactionModel"

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
 * Shared query function for every "transactions" query.
 * The API layer returns raw data; model conversion lives here so that
 * all consumers receive domain objects (TransactionModel instances).
 */
const fetchTransactions = async () => {
  const transactions = await getAllTransactions()
  return transactions.map((transaction) => new TransactionModel(transaction))
}

/**
 * Domain-specific wrapper around the shared mutation hook.
 * Every transaction mutation invalidates the ["transactions"] query on
 * settle (prefix matching also covers any sub-keys).
 *
 * Notifications can be skipped per call by passing `silent: true` in the
 * mutation variables, e.g. `updateTransaction({ id, updatedData, silent: true })`.
 */
const useTransactionMutation = (config) =>
  useMutationWithNotification({ invalidateKeys: [["transactions"]], ...config })

// ----------------------------
// Get all transactions
// ----------------------------
export const useGetAllTransactions = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    enabled,

    ...DEFAULT_QUERY_OPTIONS,
  })
}

// ----------------------------
// Get transactions by account name
// ----------------------------
// Shares the same cache entry as `useGetAllTransactions`: only one network
// request is made, and `select` filters the cached data client-side.
export const useGetTransactionsByAccountName = (
  accountName,
  { enabled = true } = {},
) => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    select: (transactions) =>
      transactions.filter(
        (transaction) => transaction.accountName === accountName,
      ),

    // Avoids firing with an empty/undefined accountName.
    enabled: enabled && !!accountName,

    ...DEFAULT_QUERY_OPTIONS,
  })
}

// ----------------------------
// Get transactions by account ID
// ----------------------------
// Same approach as above: shared cache entry + client-side filtering.
export const useGetTransactionsByAccountId = (
  accountId,
  { enabled = true } = {},
) => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    select: (transactions) =>
      transactions.filter((transaction) => transaction.accountId === accountId),

    // Avoids firing with an empty/undefined accountId.
    enabled: enabled && !!accountId,

    ...DEFAULT_QUERY_OPTIONS,
  })
}

// ----------------------------
// Create a new transaction
// ----------------------------
export const useCreateTransaction = () =>
  useTransactionMutation({
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
  useTransactionMutation({
    // Destructuring keeps extra variables (like `silent`) out of the API call.
    mutationFn: async ({ id, updatedData }) => {
      const updated = await updateTransaction({ id, updatedData })
      return new TransactionModel(updated)
    },
    successMessage: "Transaction mise à jour",
    errorMessage: "Erreur lors de la mise à jour",
  })

// ----------------------------
// Update the status of several transactions
// ----------------------------
export const useUpdateTransactionsStatus = () =>
  useTransactionMutation({
    // Destructuring keeps extra variables (like `silent`) out of the API call.
    mutationFn: async ({ ids, status }) => {
      const updated = await updateTransactionsStatus({ ids, status })
      return updated.map((transaction) => new TransactionModel(transaction))
    },
    successMessage: "Statuts des transactions mis à jour",
    errorMessage: "Erreur lors de la mise à jour des statuts",
  })

// ----------------------------
// Delete a single transaction
// ----------------------------
export const useDeleteTransaction = () =>
  useTransactionMutation({
    mutationFn: deleteTransaction,
    successMessage: "Transaction supprimée",
    errorMessage: "Erreur lors de la suppression",
  })

// ----------------------------
// Bulk delete transactions
// ----------------------------
export const useDeleteTransactions = () =>
  useTransactionMutation({
    mutationFn: deleteTransactions,
    successMessage: "Transactions supprimées",
    errorMessage: "Erreur lors de la suppression",
  })

// ----------------------------
// Validate transactions
// ----------------------------
export const useValidateTransactions = () =>
  useTransactionMutation({
    mutationFn: validateTransactions,
    successMessage: "Transactions validées",
    errorMessage: "Erreur lors de la validation",
  })
