// 🌐 React Query
import { useQuery } from "@tanstack/react-query"

// 🧰 API functions
import { validateToken } from "../api/auth"

// 📦 React imports
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

// 🗃️ State & Data fetching
import { setUser, clearUser } from "../features/userSlice"
import UserModel from "../models/UserModel"

/**
 * Custom React hook to validate and manage authentication token.
 *
 * This hook checks if a token exists in localStorage or sessionStorage,
 * validates it via the API, updates the Redux user state, and redirects
 * to the login page if the token is invalid.
 *
 * @returns {object} React Query object with token validation status and data
 */
export function useAuthToken() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Retrieve token from localStorage or sessionStorage
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
