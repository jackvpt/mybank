import TransactionModel from "../models/TransactionModel"
import axios from "axios"

const BASE_URL = "http://localhost:3000/api/transactions"

/**
 * Fetches all transactions from the API.
 * @returns {Promise<TransactionModel[]>}
 */
export const fetchAllTransactions = async () => {
  try {
    const { data } = await axios.get(BASE_URL)
    return data.map((transaction) => new TransactionModel(transaction))
  } catch (error) {
    console.error("Error fetching all transactions:", error.message)
    throw error
  }
}

/**
 * Fetches transactions by account name from the API.
 * @param {String} accountName
 * @returns {Promise<TransactionModel[]>}
 */
export const fetchTransactionsByAccountName = async (accountName) => {
  try {
    const { data } = await axios.get(BASE_URL)
    const filtered = data
      .filter((transaction) => transaction.account === accountName)
      .map((transaction) => new TransactionModel(transaction))

    return filtered
  } catch (error) {
    console.error("Error fetching transactions by account name:", error.message)
    throw error
  }
}

/**
 * Posts a new transaction to the API.
 * @param {Object} transactionData
 * @returns {Promise<TransactionModel>}
 */
export const postTransaction = async (transactionData) => {
  try {
    const { data } = await axios.post(BASE_URL, transactionData)
    return new TransactionModel(data)
  } catch (error) {
    console.error("Error posting transaction:", error.message)
    throw error
  }
}

/**
 * Updates an existing transaction by ID.
 * @param {string} params.id - The ID of the transaction to update.
 * @param {Object} params.updatedData - The data to update the transaction with.
 * @returns {Promise<TransactionModel>}
 */
export const updateTransaction = async ({ id, updatedData }) => {
  try {
    const { data } = await axios.put(`${BASE_URL}/${id}`, updatedData)
    return new TransactionModel(data)
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
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction :", error.message);
    throw error;
  }
};
