import { useQuery } from "@tanstack/react-query"
import { fetchAllTransactions } from "./api/transactions"
import { fetchBankAccounts } from "./api/bankAccounts"
import Router from "./router/Router"
import { fetchAllSettings } from "./api/settings"

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

  return <Router />
}

export default App
