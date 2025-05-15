import { useQuery } from "@tanstack/react-query"
import { fetchAllTransactions } from "./api/transactions"
import { fetchBankAccounts } from "./api/bankAccounts"
import Router from "./router/Router"

function App() {
  useQuery({
    queryKey: ["bankAccounts"],
    queryFn: fetchBankAccounts,
  })


  useQuery({
    queryKey: ["transactions"],
    queryFn: fetchAllTransactions,
  })
  
  return <Router />
}

export default App
