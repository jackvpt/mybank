import { useQuery } from "@tanstack/react-query"
import Router from "./router/Router"
import { fetchAllTransactions } from "./api/transactions"
import { fetchBankAccounts } from "./api/bankAccounts"
import { fetchAllSettings } from "./api/settings"
import { fetchAllCategories } from "./api/categories"

function App() {
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

  return <Router />
}

export default App
