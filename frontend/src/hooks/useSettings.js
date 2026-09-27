// 🔄 React Query
import { useQuery, keepPreviousData } from "@tanstack/react-query"

// 🔌 API calls
import { getAllSettings } from "../api/settings.api"

// ----------------------------
// Get all settings
// ----------------------------
export const useGetSettings = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const settings = await getAllSettings()
      // Model conversion lives here: the API layer returns raw data,
      // this hook is responsible for turning it into domain objects.
      return settings
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
