// 📡 HTTP client
import axios from "axios"

// 🔗 Config
import { COMMON_API_URL } from "./common_api_url"

// Base URL for authentication-related endpoints
const BASE_URL = `${COMMON_API_URL}/recurringtransactions`

// Create an Axios instance for easier configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Gets all recurring transactions from the API.
 * @returns {Promise<Object[]>} raw recurring transaction objects
 */
export const getAllRecurringTransactions = async () => {
  try {
    const { data } = await api.get()
    return data
  } catch (error) {
    console.error("Error fetching all recurring transactions:", error.message)
    throw error
  }
}

/**
 * Creates a new recurring transaction to the API.
 * @param {Object} transactionData
 * @returns {Promise<RecurringTransactionModel>}
 */
export const createRecurringTransaction = async (recurringTransactionData) => {
  try {
    const { data } = await api.post("", recurringTransactionData)
    return data
  } catch (error) {
    console.error("Error posting recurring transaction:", error.message)
    throw error
  }
}

/**
 * Updates an existing recurring transaction by ID.
 * @param {string} params.id - The ID of the transaction to update.
 * @param {Object} params.updatedData - The data to update the transaction with.
 * @returns {Promise<RecurringTransactionModel>}
 */
export const updateRecurringTransaction = async ({ id, updatedData }) => {
  try {
    const { data } = await api.put(`${id}`, updatedData)
    return data
  } catch (error) {
    console.error("Error updating recurring transaction:", error.message)
    throw error
  }
}

/**
 * Deletes a recurring transaction by ID.
 * @param {string} id - The ID of the transaction to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - Throws an error if the request fails.
 */
export const deleteRecurringTransaction = async (id) => {
  try {
    const { data } = await api.delete(`${id}`)
    return data
  } catch (error) {
    console.error("Error deleting recurring transaction :", error.message)
    throw error
  }
}

/**
 * Deletes multiple recurring transactions by their IDs.
 * @param {string[]} recurringTransactionsIds - An array of recurring transaction IDs to delete.
 * @returns {Promise<Object>} - The response data from the API.
 * @throws {Error} - Throws an error if the request fails or if the input is invalid.
 */
export const deleteRecurringTransactions = async (recurringTransactionsIds) => {
  if (
    !Array.isArray(recurringTransactionsIds) ||
    recurringTransactionsIds.length === 0
  ) {
    throw new Error("Aucune transaction à supprimer.")
  }

  try {
    const { data } = await api.post("/bulk-delete", {
      ids: recurringTransactionsIds,
    })
    return data
  } catch (error) {
    console.error("Error deleting transaction :", error.message)
    throw error
  }
}
