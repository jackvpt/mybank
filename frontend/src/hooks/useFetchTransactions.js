// 🌐 React Query
import { useQuery } from "@tanstack/react-query"

// 🧰 API functions
import { fetchAllTransactions } from "../api/transactions"

// 🧰 Models
import TransactionModel from "../models/TransactionModel"

/**
 * Custom React hook to fetch all transactions
 *
 * Uses React Query to fetch and cache the list of transactions from the API.
 *
 * @returns {object} React Query object containing data, status, and methods
 */
export const useFetchTransactions = () =>
  useQuery({
    queryKey: ["transactions"], // Unique cache key for transactions
    queryFn: fetchAllTransactions, // API call to fetch transactions
    refetchOnWindowFocus: false, // Do not refetch on window focus
    select: (data) => data.map((transaction) => new TransactionModel(transaction)),
  })
