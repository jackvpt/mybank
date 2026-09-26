// 📡 HTTP client
import axios from "axios"

// 🔗 Config
import { COMMON_API_URL } from "./common_api_url"

const BASE_URL = `${COMMON_API_URL}/settings`

// Create an Axios instance for easier configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// export const getAllSettings = async () => {
//   try {
//     const response = await fetch(`${BASE_URL}`)
//     if (!response.ok) throw new Error("Settings request failed")
//     const data = await response.json()
//     return data
//   } catch (error) {
//     console.error(`Error fetching settings data: ${error.message}`)
//     throw error
//   }
// }

/**
 * Gets all settings from the API.
 * @returns {Promise<Object[]>} raw settings objects
 */
export const getAllSettings = async () => {
  try {
    const { data } = await api.get("")
    return data
  } catch (error) {
    console.error("Error fetching all settings:", error.message)
    throw error
  }
}
