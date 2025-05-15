/**
 * Fetches a bank account by its name from mock data.
 *
 * @async
 * @function fetchBankAccountByName
 * @param {string} name - The name of the bank account to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the matched bank account object.
 * @throws {Error} If the fetch fails or the account is not found.
 */
export const fetchBankAccounts = async ()=>{
  try {
    const response = await fetch("/__mocks__/bankAccounts.json")
    if (!response.ok) throw new Error("Mock data request failed")
    const data = await response.json()
    return data
  } catch (error) {
    console.error(
      `Error fetching accounts data from mock data: ${error.message}`
    )
    throw error
  }
}

export const fetchBankAccountByName = async (name) => {
  try {
    const response = await fetch("/__mocks__/bankAccounts.json")
    if (!response.ok) throw new Error("Mock data request failed")
    const data = await response.json()
    const bankAccount = data.find((account) => account.name === name)

    if (!bankAccount) throw new Error(`Account ${name} not found in mock data.`)

    return bankAccount
  } catch (error) {
    console.error(
      `Error fetching accounts data from mock data: ${error.message}`
    )
    throw error
  }
}
