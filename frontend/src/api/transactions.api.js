// 📡 HTTP client
import axios from "axios"

// 🔗 Config
import { COMMON_API_URL } from "./common_api_url"

const BASE_URL = `${COMMON_API_URL}/transactions`

// Create an Axios instance for easier configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Gets all transactions from the API.
 * @returns {Promise<Object[]>} raw transaction objects
 */
export const getAllTransactions = async () => {
  try {
    const { data } = await api.get()
    return data
  } catch (error) {
    console.error("Error fetching all transactions:", error.message)
    throw error
  }
}

/**
 * Posts a new transaction to the API.
 * @param {Object} transactionData
 * @returns {Promise<Object>} raw created transaction
 */
export const createTransaction = async (transactionData) => {
  try {
    const { data } = await api.post("", transactionData)
    return data
  } catch (error) {
    console.error("Error posting transaction:", error.message)
    throw error
  }
}

/**
 * Updates an existing transaction by ID.
 * @param {string} params.id - The ID of the transaction to update.
 * @param {Object} params.updatedData - The data to update the transaction with.
 * @returns {Promise<Object>} raw updated transaction
 */
export const updateTransaction = async ({ id, updatedData }) => {
  try {
    const { data } = await api.put(`${id}`, updatedData)
    return data
  } catch (error) {
    console.error("Error updating transaction:", error.message)
    throw error
  }
}

/**
 * Deletes a transaction by ID.
 * @param {string} id - The ID of the transaction to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - Throws an error if the request fails.
 */
export const deleteTransaction = async (id) => {
  try {
    return (await api.delete(`${id}`)).data
  } catch (error) {
    console.error("Error deleting transaction :", error.message)
    throw error
  }
}

/**
 * Deletes multiple transactions by their IDs.
 * @param {string[]} transactionsIds - An array of transaction IDs to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - Throws an error if the request fails or if the input is invalid.
 */
export const deleteTransactions = async (transactionsIds) => {
  if (!Array.isArray(transactionsIds) || transactionsIds.length === 0) {
    throw new Error("Aucune transaction à supprimer.")
  }

  try {
    const response = await api.post("/bulk-delete", {
      ids: transactionsIds,
    })
    return response.data
  } catch (error) {
    console.error("Error deleting transaction :", error.message)
    throw error
  }
}

/**
 * Validate all "pointed"transactions by sending a PATCH request to the API.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - Throws an error if the request fails.
 * @returns
 */
export const validateTransactions = async () => {
  try {
    const response = await api.patch("/validate")
    return response.data
  } catch (error) {
    console.error("Error validating transactions:", error.message)
    throw error
  }
}
