import axios from "axios"

// Data
import { COMMON_API_URL } from "./common_api_url"

// Base URL for authentication-related endpoints
const BASE_URL = `${COMMON_API_URL}/bankaccounts`

/**
 * Get all bank accounts.
 *
 * @async
 * @function getAllBankAccounts
 * @returns {Promise<Object>} A promise that resolves to the matched bank account object.
 * @throws {Error} If the fetch fails or the account is not found.
 */
export const getAllBankAccounts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching accounts data: ${error.message}`)
    throw error
  }
}
