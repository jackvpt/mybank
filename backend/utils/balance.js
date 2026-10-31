const BankAccount = require("../models/BankAccount")
const Transaction = require("../models/Transaction")

// Recompute and persist the current balance of every bank account
async function recomputeBalances() {
  // Sum transaction amounts per account in a single aggregation
  const totals = await Transaction.aggregate([
    { $group: { _id: "$accountId", total: { $sum: "$amount" } } },
  ])
  const totalByAccount = new Map(totals.map((t) => [t._id, t.total]))

  const accounts = await BankAccount.find()
  await Promise.all(
    accounts.map((account) => {
      // Round to cents to avoid floating point drift
      const newBalance =
        Math.round(
          (account.initialBalance +
            (totalByAccount.get(account._id.toString()) ?? 0)) *
            100,
        ) / 100

      // Skip the write if nothing changed
      if (account.currentBalance === newBalance) return null

      account.currentBalance = newBalance
      return account.save()
    }),
  )
}

// Recompute and persist the current balance of a single bank account
async function recomputeAccountBalance(accountId) {
  const id = String(accountId)

  const [result] = await Transaction.aggregate([
    { $match: { accountId: id } },
    { $group: { _id: "$accountId", total: { $sum: "$amount" } } },
  ])

  const account = await BankAccount.findById(id)
  if (!account) return null

  // Round to cents to avoid floating point drift
  account.currentBalance =
    Math.round((account.initialBalance + (result?.total ?? 0)) * 100) / 100
  return account.save()
}

module.exports = { recomputeBalances, recomputeAccountBalance }
