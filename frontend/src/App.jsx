import { useQuery } from "@tanstack/react-query"
import Router from "./router/Router"
import { fetchAllTransactions } from "./api/transactions"
import { fetchBankAccounts } from "./api/bankAccounts"
import { fetchAllSettings } from "./api/settings"
import { fetchAllCategories } from "./api/categories"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { selectTransactionId } from "./features/settingsSlice"

function App() {
  const dispatch = useDispatch()

  useQuery({
    queryKey: ["bankAccounts"],
    queryFn: fetchBankAccounts,
  })

  useQuery({
    queryKey: ["transactions"],
    queryFn: fetchAllTransactions,
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
        dispatch(selectTransactionId(null))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [dispatch])

  return (
    <>
      {/* Main router handling all application routes */}
      <Router />
    </>
  )
}
export default App
