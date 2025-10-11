// 🌐 React Query
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTransaction } from "../api/transactions"

// 🧰 API functions

/**
 * Custom hook to add a new transaction.
 *
 * @param {object} options - Options pour gérer le succès/erreur depuis le composant appelant
 * @returns {object} Mutation object (mutate, status, etc.)
 */
export const useUpdateTransaction = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: (...args) => {
      // Invalidate the cache
      queryClient.invalidateQueries({ queryKey: ["transactions"] })

      // If the component wants to handle a toast, callback, etc.
      if (onSuccess) onSuccess(...args)
    },
    onError: (error, ...rest) => {
      console.error("Error while submitting transaction:", error)
      if (onError) onError(error, ...rest)
    },
  })
}
