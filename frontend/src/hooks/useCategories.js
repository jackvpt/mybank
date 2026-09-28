// 🔄 React Query
import { useQuery, keepPreviousData } from "@tanstack/react-query"

// 🔌 API calls
import { getAllCategories } from "../api/categories.api"

// ----------------------------
// Get all categories
// ----------------------------
export const useGetAllCategories = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const categories = await getAllCategories()
      // Model conversion lives here: the API layer returns raw data,
      // this hook is responsible for turning it into domain objects.
      return categories.sort((a, b) => a.name.localeCompare(b.name))
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
