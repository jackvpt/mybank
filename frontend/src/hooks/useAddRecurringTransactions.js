// 🌐 React Query
import { useMutation, useQueryClient } from "@tanstack/react-query"

// 🧰 API functions
import { postTransaction } from "../api/transactions"

/**
 * Custom hook to add a new transaction.
 *
 * @param {object} options - Options pour gérer le succès/erreur depuis le composant appelant
 * @returns {object} Mutation object (mutate, status, etc.)
 */
export const useAddRecurringTransactions = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transactions) => {
      return await Promise.all(transactions.map(postTransaction))
    },
        onSuccess: (...args) => {
      // Invalidate the cache
      queryClient.invalidateQueries({ queryKey: ["transactions"] })

      // If the component wants to handle a toast, callback, etc.
      if (onSuccess) onSuccess(...args)
    },
    onError: (error, ...rest) => {
      console.error("Error while submitting recurring transaction:", error)
      if (onError) onError(error, ...rest)
    },
  })
}
