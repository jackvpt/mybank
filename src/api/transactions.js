import TransactionModel from "../models/TransactionModel"

/**
 * Fetches and returns transactions for a specific account name,
 * using mock data and instantiating each as a TransactionModel.
 *
 * @async
 * @function
 * @param {string} accountName - The name of the account to filter transactions by.
 * @returns {Promise<TransactionModel[]>} A promise that resolves to an array of TransactionModel instances.
 * @throws Will throw an error if the fetch fails or the response is invalid.
 */
export const fetchTransactionsByAccountName = async (accountName) => {
  try {
    const response = await fetch("/__mocks__/transactions.json")
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

export const fetchAllTransactions = async () => {
  try {
    const response = await fetch("/__mocks__/transactions.json")
    if (!response.ok) throw new Error("Mock data request failed")

    const data = await response.json()
    const allTransactions = data
      .map((transaction) => new TransactionModel(transaction))

    return allTransactions
  } catch (error) {
    console.error(
      `Error fetching accounts data from mock data: ${error.message}`
    )
    throw error
  }
}
