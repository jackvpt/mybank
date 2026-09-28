// 🪝 Hooks
import { useAuthToken } from "/src/hooks/useAuthToken"
import { useAppData } from "/src/hooks/useAppData"

import { useDispatch } from "react-redux"
import { useEffect } from "react"

// 🔁 Redux actions
import {
  clearSelectedCheckTransactionIds,
  clearSelectedRecurringTransactionIds,
  clearSelectedTransactionIds,
} from "/src/features/parametersSlice"

// 🧩 Components
import Loader from "/src/components/Loader/Loader"

// ✅ Prop validation
import PropTypes from "prop-types"

/**
 * AppInitializer
 * ------------------------------------------------------------------
 * 1. Validates the auth token (via `useAuthToken`).
 * 2. Once auth is confirmed, fetches the bank accounts
 *    (via `useFetchBankAccounts`) — never before, to avoid firing
 *    authenticated requests with an unconfirmed token.
 * 3. Fetches transactions (business-wise dependent on accounts).
 * 4. Shows a loader while any of these stages is in flight, an
 *    error message if a fetch fails, then renders `children` once
 *    everything is ready.
 */
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch()

  // Validate token / restore session.
  const { isLoading: isAuthLoading, isSuccess: isAuthenticated } =
    useAuthToken()
  const isAuthResolved = !isAuthLoading

  const { accounts, transactions } = useAppData({ enabled: isAuthenticated })

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        dispatch(clearSelectedTransactionIds())
        dispatch(clearSelectedRecurringTransactionIds())
        dispatch(clearSelectedCheckTransactionIds())
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [dispatch])

  // Global loading state
  if (
    !isAuthResolved ||
    (isAuthenticated && (accounts.isLoading || transactions.isLoading))
  ) {
    return <Loader label="Chargement..." />
  }

  if (isAuthenticated && (accounts.isError || transactions.isError)) {
    return (
      <p>
        Error loading data:{" "}
        {accounts.error?.message || transactions.error?.message}
      </p>
    )
  }

  return children
}

AppInitializer.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppInitializer
