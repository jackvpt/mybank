export const fetchTransactionsByAccountName = async (accountName)=>{
  try {
    const response = await fetch("/__mocks__/transactions.json")
    if (!response.ok) throw new Error("Mock data request failed")
    const data = await response.json()
    const transactions = data.filter((transaction) => transaction.account === accountName)
    return transactions
  } catch (error) {
    console.error(
      `Error fetching accounts data from mock data: ${error.message}`
    )
    throw error
  }
}
