import { API_URL } from "./apiURL"
import axios from "axios"

// Base URL for authentication-related endpoints
const BASE_URL = `${API_URL}/auth`

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
 * @param {Object} options - Optional callbacks.
 * @param {Function} [options.onSuccess] - Called when validation succeeds.
 * @param {Function} [options.onError] - Called when validation fails.
 * @returns {Promise<Object>} The response data confirming token validity.
 */
export const validateToken = async (token, { onSuccess, onError }) => {
  try {
    /**
     * Make the GET request to validate the token.
     * The token is included in the Authorization header.
     */
    const response = await axios.get(`${BASE_URL}/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (onSuccess) onSuccess(response.data)
    return response.data
  } catch (error) {
    if (onError) onError(error)
    throw error
  }
}
