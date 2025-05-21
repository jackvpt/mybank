/** Imports */
const Account = require("../models/Account")

const fs = require("fs")

/** GET All Accounts */
exports.getAllAccounts = async (req, res) => {
  try {
    const allAccounts = await Account.find()
    res.status(200).json(allAccounts)
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Error retrieving accounts." })
  }
}

/** PUT Update Account */
exports.updateAccount = async (req, res) => {
  const accountObject = req.body

  try {
    const account = await Account.findOne({ _id: req.params.id })

    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      { ...accountObject, _id: req.params.id },
      { new: true }
    )
    res.status(200).json(updatedAccount)
  } catch (error) {
    res.status(401).json({ error })
  }
}
