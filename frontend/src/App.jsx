import { useQuery } from "@tanstack/react-query"
import Router from "./router/Router"
import { fetchAllTransactions } from "./api/transactions"
import { fetchBankAccounts } from "./api/bankAccounts"
import { fetchAllSettings } from "./api/settings"
import { fetchAllCategories } from "./api/categories"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import {
  clearSelectedCheckTransactionIds,
  clearSelectedRecurringTransactionIds,
  clearSelectedTransactionIds,
} from "./features/parametersSlice"
import { fetchAllRecurringTransactions } from "./api/recurringTransactions"
import { useAuthToken } from "./hooks/useAuthToken"
import Loader from "./components/Loader/Loader"

function App() {
  const dispatch = useDispatch()

  // Token validation
  const { isAuthLoading } = useAuthToken()

  useQuery({
    queryKey: ["bankAccounts"],
    queryFn: fetchBankAccounts,
  })

  useQuery({
    queryKey: ["transactions"],
    queryFn: fetchAllTransactions,
  })

  useQuery({
    queryKey: ["recurringTransactions"],
    queryFn: fetchAllRecurringTransactions,
  })

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

  if (isAuthLoading) return <Loader />

  return (
    <>
      {/* Main router handling all application routes */}
      <Router />
    </>
  )
}
export default App
