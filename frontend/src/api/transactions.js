import TransactionModel from "../models/TransactionModel"

/**
 * Fetches all transactions from the API.
 * @returns {Promise<TransactionModel[]>} - A promise that resolves to an array of TransactionModel instances.
 * @throws {Error} - Throws an error if the fetch request fails.
 */
export const fetchAllTransactions = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/transactions")
    if (!response.ok) throw new Error("API data request failed")

    const data = await response.json()
    const allTransactions = data
      .map((transaction) => new TransactionModel(transaction))

    return allTransactions
  } catch (error) {
    console.error(
      `Error fetching transactions from data: ${error.message}`
    )
    throw error
  }
}
/**
 * Fetches transactions by account name from the API.
 * @async
 * @param {String} accountName 
 * @returns {Promise<TransactionModel[]>} - A promise that resolves to an array of TransactionModel instances. 
 */
export const fetchTransactionsByAccountName = async (accountName) => {
  try {
    const response = await fetch("http://localhost:3000/api/transactions")
    if (!response.ok) throw new Error("Mock data request failed")

    const data = await response.json()
    const transactions = data
      .filter((transaction) => transaction.account === accountName)
      .map((transaction) => new TransactionModel(transaction))

    return transactions
  } catch (error) {
    console.error(
      `Error fetching accounts data from mock data: ${error.message}`
    )
    throw error
  }
}