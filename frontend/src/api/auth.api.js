// Data
import { COMMON_API_URL } from "./common_api_url"

// Axios
import axios from "axios"

// Base URL for authentication-related endpoints
const BASE_URL = `${COMMON_API_URL}/auth`

/**
 * Register a new user.
 *
 * @async
 * @function signup
 * @param {Object} userData - The user information for registration.
 * @param {string} userData.username - The username of the user.
 * @param {string} userData.email - The email address of the user.
 * @param {string} userData.password - The password of the user.
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Object} Error response from the server or network error.
 */
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, userData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error.response?.data || error
  }
}

/**
 * Authenticate a user and retrieve a token.
 *
 * @async
 * @function login
 * @param {Object} userData - The login credentials.
 * @param {string} userData.email - The email address of the user.
 * @param {string} userData.password - The password of the user.
 * @returns {Promise<Object>} The response data containing authentication details.
 * @throws {Object} Error response from the server or network error.
 */
export const login = async (userData) => {
  try {
    /**
     * Make the POST request to the login endpoint with user credentials.
     */
    const response = await axios.post(`${BASE_URL}/login`, userData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error.response?.data || error
  }
}

/**
 * Validate an authentication token.
 *
 * @async
 * @function validateToken
 * @param {string} token - The JWT authentication token to validate.
 * @returns {Promise<Object>} The response data confirming token validity.
 * @throws {Object} Error response from the server or network error.
 */
export const validateToken = async (token) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (error) {
    console.error("Error validating token:", error)
    throw error.response?.data || error
  }
}

/**
 * Update the current user's password.
 *
 * @async
 * @function updatePassword
 * @param {Object} params - Parameters for updating the password.
 * @param {string} params.currentPassword - The user's current password.
 * @param {string} params.newPassword - The new password to set.
 * @returns {Promise<Object>} The response data confirming password update.
 * @throws {Object} Error response from the server or network error.
 */
export const updatePassword = async ({ currentPassword, newPassword }) => {
  try {
    // Retrieve token from localStorage or sessionStorage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token")

    /**
     * Make the PUT request to update the password.
     * The token is included in the Authorization header.
     */
    const response = await axios.put(
      `${BASE_URL}/update-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error("Error updating password:", error)
    throw error
  }
}

/**
 * Request a password reset link.
 *
 * @param {Object} param0 - The request parameters.
 * @param {string} param0.email - The email address of the user requesting the reset.
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Object} Error response from the server or network error.
 */
export const requestPasswordReset = async ({ email }) => {
  try {
    // Make the POST request to request a password reset link
    const response = await axios.post(`${BASE_URL}/request-password-reset`, {
      email,
    })
    return response.data
  } catch (error) {
    console.error("Error requesting password reset:", error)
    throw error
  }
}

/**
 * Reset the user's password using a token.
 *
 * @async
 * @function resetPassword
 * @param {Object} params - Parameters for resetting the password.
 * @param {string} params.token - The reset token from the email link.
 * @param {string} params.newPassword - The new password to set.
 * @returns {Promise<Object>} The response data confirming password reset.
 * @throws {Object} Error response from the server or network error.
 */
export const resetPassword = async ({ token, newPassword }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/reset-password`,
      { newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return response.data
  } catch (error) {
    console.error("Error resetting password:", error)
    throw error.response?.data || error
  }
}
