// 🔄 React Query
import { useQuery, keepPreviousData } from "@tanstack/react-query"

// 🔌 API calls
import { getAllBankAccounts } from "../api/bankAccounts.api"

// 🧬 Models
import TransactionModel from "../models/TransactionModel"

// ----------------------------
// Get all transactions
// ----------------------------
export const useGetBankAccounts = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["bankaccounts"],
    queryFn: async () => {
      const bankAccounts = await getAllBankAccounts()
      // Model conversion lives here: the API layer returns raw data,
      // this hook is responsible for turning it into domain objects.
      return bankAccounts.map(
        (bankAccount) => new TransactionModel(bankAccount),
      )
    },

    enabled,

    // v5 replacement for `keepPreviousData: true`: keeps showing the
    // last successful data while a refetch is in flight, instead of
    // flashing a loading state.
    placeholderData: keepPreviousData,

    staleTime: 10000 * 60, // 10 minutes
    refetchInterval: 600000, // poll every 10 minutes — matches staleTime above
  })
}
