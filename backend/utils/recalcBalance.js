const BankAccount = require("../models/BankAccount")
const Transaction = require("../models/Transaction")
const mongoose = require("mongoose")

async function recalcBalance(accountId) {
  // 1. Total of transactions for the account
  const [{ totalTransactions = 0 } = {}] = await Transaction.aggregate([
    { $match: { accountId } },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: "$amount" }, // somme directe du champ amount
      },
    },
  ])

  // 2. Retrieve the account
  const account = await BankAccount.findById(accountId)

  if (!account) {
    throw new Error("Bank account not found")
  }

  // 3. Calculate the new balance
  const newBalance = account.initialBalance + totalTransactions
  console.log("newBalance :>> ", newBalance)

  // 4. Update the account
  account.currentBalance = newBalance
  await account.save()

  return newBalance
}

module.exports = recalcBalance
