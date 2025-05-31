/** Imports */
const Transaction = require("../models/Transaction")

const fs = require("fs")

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
    res.status(200).json({ message: "Transaction deleted successfully!" })
    console.log(`Transaction deleted: ${req.params.id}`)
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Error deleting transaction!" })
  }
}
