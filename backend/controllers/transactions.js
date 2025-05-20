/** Imports */
const Transaction = require("../models/Transaction")

const fs = require("fs")

/** GET All Transactions */
exports.getAllTransactions = async (req, res) => {
  try {
    const allTransactions = await Transaction.find()
    res.status(200).json(allTransactions)
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Error retrieving transactions." })
  }
}
