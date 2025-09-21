// 🌐 React Query
import { useQuery } from "@tanstack/react-query"

// 🧰 API functions
import { fetchBankAccounts } from "../api/bankAccounts"
import BankAccountModel from "../models/BankAccountModel"
import { useSelector } from "react-redux"

/**
 * Custom React hook to fetch all guest houses.
 *
 * Uses React Query to fetch and cache the list of guest houses from the API.
 *
 * @returns {object} React Query object containing data, status, and methods
 */
export const useFetchBankAccounts = () => {
  const user = useSelector((state) => state.user)
  const isAuthenticated = !!user.id

  return useQuery({
    queryKey: ["bankAccounts"], // Unique cache key for bank accounts
    queryFn: fetchBankAccounts, // API call to fetch bank accounts
    enabled: isAuthenticated, // Only run the query if the user is authenticated
    refetchOnWindowFocus: false, // Do not refetch on window focus
    select: (data) => data.map((account) => new BankAccountModel(account)),
  })
}
