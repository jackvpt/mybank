/** Imports */
const Transaction = require("../models/Transaction")
const { recomputeAccountBalance } = require("../utils/balance")

/** GET All Transactions */
exports.getAllTransactions = async (req, res) => {
  try {
    const allTransactions = await Transaction.find()
    res.status(200).json(allTransactions)
    console.log(`${allTransactions.length} transactions retrieved`)
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Error retrieving transactions." })
  }
}

/** POST New Transaction */
exports.createTransaction = async (req, res) => {
  const transactionObject = req.body
  console.log("Creating transaction:", transactionObject) // Log the incoming transaction object

  try {
    const transaction = new Transaction({
      ...transactionObject,
    })

    await transaction.save()

    // Update the balance of the affected account
    await recomputeAccountBalance(transaction.accountId)

    res.status(201).json(transaction)
    console.log(
      `Transaction created: ${transaction._id} - ${transaction.label}`,
    )
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Error adding transaction!" })
  }
}

/** PUT Update Transaction */
exports.updateTransaction = async (req, res) => {
  const transactionObject = req.body

  try {
    const oldTransaction = await Transaction.findById(req.params.id)
    if (!oldTransaction) {
      return res.status(404).json({ error: "Transaction not found" })
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { ...transactionObject, _id: req.params.id },
      { new: true, runValidators: true },
    )

    // Recompute the new account, and the old one if the transaction was moved
    await recomputeAccountBalance(updatedTransaction.accountId)
    if (oldTransaction.accountId !== updatedTransaction.accountId) {
      await recomputeAccountBalance(oldTransaction.accountId)
    }

    res.status(200).json(updatedTransaction)
    console.log(
      `Transaction updated: ${updatedTransaction._id} - ${updatedTransaction.label}`,
    )
  } catch (error) {
    res.status(401).json({ error })
  }
}

/** PATCH Update Transactions Status */
exports.updateTransactionsStatus = async (req, res) => {
  const { ids, status } = req.body

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "ids must be a non-empty array" })
  }

  if (!["pointed", ""].includes(status)) {
    return res.status(400).json({ error: "Invalid status" })
  }

  try {
    const result = await Transaction.updateMany(
      { _id: { $in: ids } },
      { $set: { status } },
    )
    const updatedTransactions = await Transaction.find({ _id: { $in: ids } })

    res.status(200).json(updatedTransactions)
    console.log(`Transactions status updated -> "${status}"`)
  } catch (error) {
    res.status(500).json({ error })
  }
}

/** DELETE One Transaction */
exports.deleteTransaction = async (req, res) => {
  try {
    // Delete first, then use the returned document to know which account to recompute
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.id,
    )
    if (deletedTransaction) {
      await recomputeAccountBalance(deletedTransaction.accountId)
    }

    res.status(200).json({ message: "Transaction deleted successfully!" })
    console.log(`Transaction deleted: ${req.params.id}`)
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Error deleting transaction!" })
  }
}

/** DELETE Multiple Transactions */
exports.deleteTransactions = async (req, res) => {
  const { ids } = req.body

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ error: "A non-empty array of IDs is required." })
  }

  try {
    // Collect the affected accounts before the transactions disappear
    const accountIds = await Transaction.distinct("accountId", {
      _id: { $in: ids },
    })

    const result = await Transaction.deleteMany({ _id: { $in: ids } })

    await Promise.all(accountIds.map((id) => recomputeAccountBalance(id)))
    res.status(200).json({
      message: "Transactions deleted successfully!",
      deletedCount: result.deletedCount,
    })

    console.log(
      `Deleted ${result.deletedCount} transactions: ${ids.join(", ")}`,
    )
  } catch (error) {
    res.status(500).json({
      error: error.message || "Error deleting transactions!",
    })
  }
}

/** VALIDATE ALL "pointed" Transactions */
exports.validateTransactions = async (req, res) => {
  try {
    const result = await Transaction.updateMany(
      { status: "pointed" },
      { $set: { status: "validated" } },
    )

    res.status(200).json({
      message: "All pointed transactions have been validated.",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    })

    console.log(`Validated ${result.modifiedCount} pointed transactions.`)
  } catch (error) {
    res.status(500).json({
      error: error.message || "Error validating pointed transactions.",
    })
  }
}
