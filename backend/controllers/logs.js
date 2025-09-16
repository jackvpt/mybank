/** Imports */
const Log = require("../models/Log")

/** GET All Logs */
exports.getAllLogs = async (req, res) => {
  try {
    const allLogs = await Log.find()
    res.status(200).json(allLogs)
  } catch (error) {
    res.status(400).json({ error: error.message || "Error retrieving logs." })
  }
}
