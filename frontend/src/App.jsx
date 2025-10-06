import { useQuery } from "@tanstack/react-query"
import Router from "./router/Router"
import { fetchAllSettings } from "./api/settings"
import { fetchAllCategories } from "./api/categories"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import {
  clearSelectedCheckTransactionIds,
  clearSelectedRecurringTransactionIds,
  clearSelectedTransactionIds,
} from "./features/parametersSlice"
import { useAuthToken } from "./hooks/useAuthToken"
import Loader from "./components/Loader/Loader"
import { useFetchBankAccounts } from "./hooks/useFetchBankAccounts"
import { useFetchTransactions } from "./hooks/useFetchTransactions"
import { useFetchRecurringTransactions } from "./hooks/useFetchRecurringTransactions"

function App() {
  const dispatch = useDispatch()

  // Token validation
  const { isLoading: isAuthLoading } = useAuthToken()

  const { isLoading: isLoadingBankAccounts } = useFetchBankAccounts()

  const { isLoading: isLoadingTransactions } = useFetchTransactions()

  const { isLoading: isLoadingRecurringTransactions } =
    useFetchRecurringTransactions()

  useQuery({
    queryKey: ["settings"],
    queryFn: fetchAllSettings,
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

  if (
    isAuthLoading ||
    isLoadingBankAccounts ||
    isLoadingTransactions ||
    isLoadingRecurringTransactions
  )
    return <Loader />

  return (
    <>
      {/* Main router handling all application routes */}
      <Router />
    </>
  )
}
export default App
