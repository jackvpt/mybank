// ⚛️ React
import { useContext, useMemo } from "react"

// 🔔 Shared context
import { NotificationContext } from "./NotificationContext.js"

/**
 * useNotification
 * ------------------------------------------------------------------
 * Custom hook to access the notification context. Throws early if
 * used outside of `NotificationProvider`, so misuse fails loudly
 * during development instead of silently returning `undefined`.
 */
const noop = () => {}

export const useNotification = ({ silent = false } = {}) => {
  const context = useContext(NotificationContext)
  const value = useMemo(
    () =>
      silent && context
        ? { ...context, notifySuccess: noop, notifyError: noop }
        : context,
    [silent, context],
  )
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider")
  }
  return value
}
