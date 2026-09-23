// ⚛️ React
import { useState, useCallback, useMemo } from "react"

// 💅 UI (MUI)
import { Snackbar, Alert } from "@mui/material"

// ✅ Prop validation
import PropTypes from "prop-types"

// 🔔 Shared context
import { NotificationContext } from "./NotificationContext.js"

const SEVERITIES = ["success", "error", "warning", "info"]

/**
 * NotificationProvider
 * ------------------------------------------------------------------
 * App-wide toast/snackbar system built on MUI's Snackbar + Alert.
 * Exposes `notify(message, severity)` plus convenience helpers
 * (`notifySuccess`, `notifyError`, `notifyWarning`, `notifyInfo`) via
 * context, so any component can trigger a notification without
 * managing its own Snackbar instance.
 */
export const NotificationProvider = ({ children, autoHideDuration = 4000 }) => {
  const [notification, setNotification] = useState(null)

  const notify = useCallback((message, severity = "success") => {
    setNotification({ message, severity, id: Date.now() })
  }, [])

  const handleClose = useCallback((_event, reason) => {
    if (reason === "clickaway") return
    setNotification(null)
  }, [])

  const shorthands = useMemo(
    () =>
      Object.fromEntries(
        SEVERITIES.map((severity) => [
          `notify${severity[0].toUpperCase()}${severity.slice(1)}`,
          (message) => notify(message, severity),
        ]),
      ),
    [notify],
  )

  const contextValue = useMemo(
    () => ({ notify, ...shorthands }),
    [notify, shorthands],
  )

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      <Snackbar
        key={notification?.id}
        open={!!notification}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={notification?.severity || "success"}
          variant="filled"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
  autoHideDuration: PropTypes.number,
}