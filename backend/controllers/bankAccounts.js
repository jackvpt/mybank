/** Imports */
const BankAccount = require("../models/BankAccount")

const fs = require("fs")

/** GET All Accounts */
exports.getAllBankAccounts = async (req, res) => {
  try {
    const allBankAccounts = await BankAccount.find()
    res.status(200).json(allBankAccounts)
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Error retrieving bank accounts." })
  }
}

/** PUT Update Account */
exports.updateBankAccount = async (req, res) => {
  const bankAccountObject = req.body

  try {
    const bankAccount = await BankAccount.findOne({ _id: req.params.id })

    const updatedBankAccount = await BankAccount.findByIdAndUpdate(
      req.params.id,
      { ...bankAccountObject, _id: req.params.id },
      { new: true }
    )
    res.status(200).json(updatedBankAccount)
  } catch (error) {
    res.status(401).json({ error })
  }
}
