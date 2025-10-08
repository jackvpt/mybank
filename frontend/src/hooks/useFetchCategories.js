// 🌐 React Query
import { useQuery } from "@tanstack/react-query"

// 🧰 API functions
import { fetchAllCategories } from "../api/categories"

// 🧰 Models
import CategoryModel from "../models/CategoryModel"

/**
 * Custom React hook to fetch all transactions
 *
 * Uses React Query to fetch and cache the list of transactions from the API.
 *
 * @returns {object} React Query object containing data, status, and methods
 */
export const useFetchCategories = () =>
  useQuery({
    queryKey: ["categories"], // Unique cache key for categories
    queryFn: fetchAllCategories, // API call to fetch categories
    refetchOnWindowFocus: false, // Do not refetch on window focus
    select: (data) => data.map((category) => new CategoryModel(category)),
  })
