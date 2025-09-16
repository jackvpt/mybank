import RecurringTransactionModel from "../models/RecurringTransactionModel"
import axios from "axios"

import { API_URL } from "./apiURL"

// Base URL for authentication-related endpoints
const BASE_URL = `${API_URL}/recurringtransactions`

/**
 * Fetches all recurring transactions from the API.
 * @returns {Promise<RecurringTransactionModel[]>}
 */
export const fetchAllRecurringTransactions = async () => {
  try {
    const { data } = await axios.get(BASE_URL)
    return data.map((recurringTransaction) => new RecurringTransactionModel(recurringTransaction))
  } catch (error) {
    console.error("Error fetching all recurring transactions:", error.message)
    throw error
  }
}

/**
 * Posts a new recurring transaction to the API.
 * @param {Object} transactionData
 * @returns {Promise<RecurringTransactionModel>}
 */
export const postRecurringTransaction = async (recurringTransactionData) => {
  try {
    const { data } = await axios.post(BASE_URL, recurringTransactionData)
    return new RecurringTransactionModel(data)
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
    const { data } = await axios.put(`${BASE_URL}/${id}`, updatedData)
    return new RecurringTransactionModel(data)
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
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting recurring transaction :", error.message);
    throw error;
  }
};

export const deleteRecurringTransactions = async (recurringTransactionsIds) => {
  if (!Array.isArray(recurringTransactionsIds) || recurringTransactionsIds.length === 0) {
    throw new Error("Aucune transaction à supprimer.")
  }

  try {
    const response = await axios.post(`${BASE_URL}/bulk-delete`, {
      ids: recurringTransactionsIds,
    })
    return response.data
  } catch (error) {
    console.error("Error deleting transaction :", error.message)
    throw error
  }
}
