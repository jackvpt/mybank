import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNotification } from "./useNotification"

/**
 * Wraps `useMutation` with notifications + cache invalidation.
 * - `invalidateKeys`: query keys to invalidate on settle (ex: [["transactions"]])
 * - `invalidate: false`: opt out of invalidation
 * - `variables.silent`: skip notifications for this call
 */
export const useMutationWithNotification = ({
  invalidateKeys = [],
  ...config
}) => {
  const queryClient = useQueryClient()
  const { notifySuccess, notifyError } = useNotification()

  return useMutation({
    ...config,

    onSuccess: (data, variables, context) => {
      if (config.successMessage && !variables?.silent) {
        notifySuccess(
          typeof config.successMessage === "function"
            ? config.successMessage(data)
            : config.successMessage,
        )
      }
      config.onSuccess?.(data, variables, context)
    },

    onError: (error, variables, context) => {
      if (!variables?.silent) {
        notifyError(
          error?.message || config.errorMessage || "Une erreur est survenue",
        )
      }
      config.onError?.(error, variables, context)
    },

    onSettled: (data, error, variables, context) => {
      if (config.invalidate !== false) {
        invalidateKeys.forEach((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        )
      }
      config.onSettled?.(data, error, variables, context)
    },
  })
}