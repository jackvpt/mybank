import { useQuery, keepPreviousData } from "@tanstack/react-query"

import TransactionModel from "../models/TransactionModel"
import { fetchAllTransactions } from "../api/transactions.api"

// export const useFetchTransactions = () => {
//   const select = useCallback(
//     (data) => data.map((transaction) => new TransactionModel(transaction)),
//     [],
//   )

//   return useQuery({
//     queryKey: ["transactions"],
//     queryFn: fetchAllTransactions,
//     refetchOnWindowFocus: false,
//     select,
//   })
// }

// ----------------------------
// Fetch all transactions
// ----------------------------
export const useFetchTransactions = ({ enabled = true } = {}) => {
  const queryResult = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const accounts = await fetchAllTransactions()
      return accounts.map((a) =>
        a instanceof TransactionModel ? a : new TransactionModel(a),
      )
    },
    enabled,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
    placeholderData: keepPreviousData,
  })
  return queryResult
}
