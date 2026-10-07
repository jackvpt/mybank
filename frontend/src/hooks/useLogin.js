// 🌐 React Query
import { useMutation } from "@tanstack/react-query"

// 🧰 API functions
import { login } from "../api/auth.api"

// 📦 React imports
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

// 🗃️ State & Data fetching
import { setUser } from "../store/features/userSlice"
import UserModel from "../models/UserModel"

/**
 * Custom React hook to handle user login.
 *
 * This hook performs the login request, stores the token,
 * updates the Redux user state, and redirects to the dashboard page.
 *
 * @returns {object} React Query mutation object for login
 */
export function useLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ email, password, rememberMe = true }) => {
      let data

      try {
        data = await login({ email, password })
      } catch (err) {
        // No answer from server (network error, server down, CORS issue, etc.)
        if (!err.response) {
          throw new Error("Network error: Could not reach the server.")
        }
        if (err.response.status === 401) {
          throw new Error("Email or password incorrect.")
        }
        throw new Error(
          err.response.data?.message ??
            "An error occurred. Please try again later.",
        )
      }

      // Token saved in localStorage or sessionStorage based on 'remember' flag
      if (rememberMe) {
        localStorage.setItem("mybank_token", data.token)
        sessionStorage.removeItem("mybank_token") // Clear sessionStorage if 'rememberMe' is true
      } else {
        sessionStorage.setItem("mybank_token", data.token)
        localStorage.removeItem("mybank_token") // Clear localStorage if 'rememberMe' is false
      }

      return data
    },
    onSuccess: (data) => {
      console.log("✅ Login success", data.user)
      dispatch(setUser(new UserModel(data.user).toPlain()))
      navigate("/dashboard", { replace: true }) // Redirection after login
    },
    onError: (error) => {
      console.error("❌ Login failed:", error)
    },
  })
}
