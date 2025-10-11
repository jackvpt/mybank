// 🌐 React Query
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBankAccount } from "../api/bankAccounts"

// 🧰 API functions

/**
 * Custom hook to add a new transaction.
 *
 * @param {object} options - Options pour gérer le succès/erreur depuis le composant appelant
 * @returns {object} Mutation object (mutate, status, etc.)
 */
export const useUpdateBankAccount = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBankAccount,
    onSuccess: (...args) => {
      // Invalidate the cache
      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] })

      // If the component wants to handle a toast, callback, etc.
      if (onSuccess) onSuccess(...args)
    },
    onError: (error, ...rest) => {
      console.error("Error while updating bank account:", error)
      if (onError) onError(error, ...rest)
    },
  })
}
