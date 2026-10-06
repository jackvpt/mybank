// 🔄 React
import { useEffect } from "react"

// 🔄 React Query
import { useQuery } from "@tanstack/react-query"

// 🗃️ React Redux
import { useDispatch } from "react-redux"

// 🌐 React Router
import { useNavigate } from "react-router-dom"

// 🔌 API calls
import { validateToken } from "../api/auth.api"

// 🍰 Redux features
import { setUser, clearUser } from "../store/features/userSlice"

// 🧩 Models
import UserModel from "../models/UserModel"

/**
 * useAuthToken
 * ------------------------------------------------------------------
 * Custom hook that validates the current auth token on mount (and on
 * every refetch) and keeps Redux state / routing in sync with the
 * result.
 *
 * Behavior:
 * 1. Reads the token from localStorage OR sessionStorage.
 * 2. If no token exists, the query is disabled (`enabled: !!token`)
 *    — nothing happens, no redirect, no dispatch.
 * 3. If a token exists, it's validated against the API.
 *    - On success: user data + token are stored in Redux.
 *
 * @returns {UseQueryResult} the full React Query result object
 *          (status, data, error, isLoading, isFetching, refetch, ...)
 */
export function useAuthToken() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Token is read synchronously on every render. Because it's part of
  // the queryKey below, React Query will automatically re-run the
  // query whenever the token value changes (e.g. after a login sets
  // a new token in storage and this hook re-renders).
  const token = localStorage.getItem("mybank_token") || sessionStorage.getItem("mybank_token")

const query = useQuery({
  queryKey: ["token", token],
  queryFn: () => validateToken(token),
  enabled: !!token,
  retry: false,
  staleTime: 0,
  refetchOnWindowFocus: false,
  retryOnMount: false,
  refetchInterval: (q) => (q.state.status === "error" ? false : 30000),
})

// ✅ Replaces onSuccess
useEffect(() => {
  if (query.data) {
    dispatch(setUser(new UserModel(query.data.user)))
  }
}, [query.data, dispatch])

// ❌ Replaces onError
useEffect(() => {
  if (!query.error) return

  const status = query.error.response?.status
  if (status === 401 || status === 403) {
    // token réellement invalide → déconnexion
    localStorage.removeItem("mybank_token")
    sessionStorage.removeItem("mybank_token")
    dispatch(clearUser())
    navigate("/login", { replace: true })
  } else {
    // Network / backend down : token kept in storage, user kept in Redux, no redirect. Just log a warning.
    console.warn("Backend not available, token not invalidated:", query.error.message)
  }
}, [query.error, dispatch, navigate])

return query
}
