// 🌐 React Query
import { useMutation } from "@tanstack/react-query"

// 🧰 API functions
import { login } from "../api/auth"

// 📦 React imports
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

// 🗃️ State & Data fetching
import { setUser } from "../features/userSlice"
import UserModel from "../models/UserModel"

/**
 * Custom React hook to handle user login.
 *
 * This hook performs the login request, stores the token,
 * updates the Redux user state, and redirects to the home page.
 *
 * @returns {object} React Query mutation object for login
 */
export function useLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ email, password, rememberMe = true }) => {
      const data = await login({ email, password })

      // Token saved in localStorage or sessionStorage based on 'remember' flag
      if (rememberMe) {
        localStorage.setItem("token", data.token)
      } else {
        sessionStorage.setItem("token", data.token)
      }
      return data
    },
    onSuccess: (data) => {
      console.log("✅ Login success", data.user)
      dispatch(setUser(new UserModel(data.user)))
      navigate("/dashboard", { replace: true }) // Redirection after login
    },
    onError: (error) => {
      console.error("❌ Login failed:", error.message)
    },
  })
}
