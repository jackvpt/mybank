/** Imports */
const mongoose = require('mongoose');
const Transaction = require("../models/Transaction")

const fs = require("fs")
const recalcBalance = require("../utils/recalcBalance")

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

  try {
    const transaction = new Transaction({
      ...transactionObject,
    })

    await transaction.save()

    // Recalculate account balance
    await recalcBalance(transaction.accountId)

    res.status(201).json(transaction)
    console.log(
      `Transaction created: ${transaction._id} - ${transaction.label}`
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
    const transaction = await Transaction.findOne({ _id: req.params.id })

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { ...transactionObject, _id: req.params.id },
      { new: true }
    )

    // Recalculate account balance
    if (updatedTransaction) await recalcBalance(transaction.accountId)

    res.status(200).json(updatedTransaction)
    console.log(
      `Transaction updated: ${updatedTransaction._id} - ${updatedTransaction.label}`
    )
  } catch (error) {
    res.status(401).json({ error })
  }
}

/** DELETE One Transaction */
exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.deleteOne({ _id: req.params.id })

    // Recalculate account balance
    await recalcBalance(transaction.accountId)

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
    // Retrieve a transaction to get the accountId
    const sampleTransaction = await Transaction.findOne({
      _id: ids[0],
    })
    if (!sampleTransaction) {
      return res.status(404).json({ error: "Transaction not found." })
    }
    const accountId = sampleTransaction.accountId

    const result = await Transaction.deleteMany({ _id: { $in: ids } })
    // Recalculate account balance
    await recalcBalance(accountId)

    res.status(200).json({
      message: "Transactions deleted successfully!",
      deletedCount: result.deletedCount,
    })

    console.log(
      `Deleted ${result.deletedCount} transactions: ${ids.join(", ")}`
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
      { $set: { status: "validated" } }
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
