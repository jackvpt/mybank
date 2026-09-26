// 🪝 Hooks
import { useAuthToken } from "/src/hooks/useAuthToken"
import { useGetBankAccounts } from "/src/hooks/useBankAccounts"
import { useGetTransactions } from "/src/hooks/useTransactions"
import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { useEffect } from "react"

// 🌐 API
import { getAllSettings } from "/src/api/settings.api"
import { fetchAllCategories } from "/src/api/categories"
import { fetchAllRecurringTransactions } from "/src/api/recurringTransactions"

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

  // Step 1: validate token / restore session.
  const { isLoading: isAuthLoading, isSuccess: isAuthenticated } =
    useAuthToken()
  const isAuthResolved = !isAuthLoading

  // Step 2: bank accounts, ONLY once auth is confirmed.
  const {
    isLoading: accountsLoading,
    isError: accountsError,
    error: accountsErrorObj,
  } = useGetBankAccounts()

  // Step 3: transactions, once auth is confirmed.
  const {
    isLoading: transactionsLoading,
    isError: transactionsError,
    error: transactionsErrorObj,
  } = useGetTransactions()

  // Secondary data — non-blocking for rendering, but still gated on
  // auth to avoid calls with an invalid token.
  useQuery({
    queryKey: ["recurringTransactions"],
    queryFn: fetchAllRecurringTransactions,
  })

  useQuery({
    queryKey: ["settings"],
    queryFn: getAllSettings,
  })

  useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  })

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
    (isAuthenticated && (accountsLoading || transactionsLoading))
  ) {
    return <Loader />
  }

  // Global error state
  if (isAuthenticated && (accountsError || transactionsError)) {
    return (
      <p>
        Error loading data:{" "}
        {accountsErrorObj?.message || transactionsErrorObj?.message}
      </p>
    )
  }


  return children
}

AppInitializer.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppInitializer
