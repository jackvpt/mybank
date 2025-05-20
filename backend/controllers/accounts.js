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
