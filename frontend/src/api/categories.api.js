// 📡 HTTP client
import axios from "axios"

// Data
import { COMMON_API_URL } from "./common_api_url"

// Base URL for authentication-related endpoints
const BASE_URL = `${COMMON_API_URL}/categories`

// Create an Axios instance for easier configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Fetches all categories from the API.
 * @function getAllCategories
 * @description This function retrieves all categories from the API endpoint.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of categories.
 */
export const getAllCategories = async () => {
  try {
    const { data } = await api.get()
    return data
  } catch (error) {
    console.error("Error fetching all categories:", error.message)
    throw error
  }
}
