// ⚛️ React
import { useContext } from "react"

// 🔔 Shared context
import { NotificationContext } from "./NotificationContext.js"

/**
 * useNotification
 * ------------------------------------------------------------------
 * Custom hook to access the notification context. Throws early if
 * used outside of `NotificationProvider`, so misuse fails loudly
 * during development instead of silently returning `undefined`.
 */
export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider")
  }
  return context
}