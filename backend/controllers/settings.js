/** Imports */
const Setting = require("../models/Setting")

const fs = require("fs")

/** GET All Settings */
exports.getAllSettings = async (req, res) => {
  try {
    const allSettings = await Setting.find()
    res.status(200).json(allSettings)
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Error retrieving settings." })
  }
}
