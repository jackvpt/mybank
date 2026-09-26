// 🔄 React Query
import { useQuery } from "@tanstack/react-query"

// 🗃️ React Redux
import { useDispatch } from "react-redux"

// 🌐 React Router
import { useNavigate } from "react-router-dom"

// 🔌 API calls
import { validateToken } from "../api/auth.api"

// 🍰 Redux features
import { setUser, clearUser } from "../features/userSlice"

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
 *    - On failure: token is wiped from both storages, Redux user
 *      state is cleared, and the user is redirected to /login.
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
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")

  return useQuery({
    queryKey: ["token", token],
    queryFn: () => validateToken(token),
    enabled: !!token,
    retry: false,
    refetchInterval: 30000,
    staleTime: 0,
    onSuccess: (data) => {
      console.log("✅ Token is valid", data)
      dispatch(setUser(new UserModel(data.user)))
    },
    onError: (err) => {
      console.log("❌ Token validation failed:", err.message)
      localStorage.removeItem("token")
      sessionStorage.removeItem("token")
      dispatch(clearUser())
      navigate("/login", { replace: true })
    },
  })
}
