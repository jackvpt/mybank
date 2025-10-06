// 🌐 React Query
import { useQuery } from "@tanstack/react-query"

// 🧰 API functions
import { fetchAllRecurringTransactions } from "../api/recurringTransactions"

// 🧰 Models
import RecurringTransactionModel from "../models/RecurringTransactionModel"

/**
 * Custom React hook to fetch all recurring transactions.
 *
 * Uses React Query to fetch and cache the list of recurring transactions from the API.
 *
 * @returns {object} React Query object containing data, status, and methods
 */
export const useFetchRecurringTransactions = () =>
  useQuery({
    queryKey: ["recurringTransactions"], // Unique cache key for recurring transactions
    queryFn: fetchAllRecurringTransactions, // API call to fetch recurring transactions
    refetchOnWindowFocus: false, // Do not refetch on window focus
    select: (data) => data.map((recurringTransaction) => new RecurringTransactionModel(recurringTransaction)),
  })
