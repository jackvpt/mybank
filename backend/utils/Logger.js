const Log = require("../models/Log")

/**
 * Creates a log entry.
 * @param {*} email - The email of the user.
 * @param {*} action - The action performed by the user.
 * @param {*} remarks - Additional remarks about the action.
 * @returns {Promise<void>}
 */
async function createLog(email, action, remarks) {
  try {
    if (action === "Token validated") {
      const lastLog = await Log.findOne({ email }).sort({ date: -1 }).lean()
      if (lastLog && lastLog.action === "Token validated") {
        let match = lastLog.remarks?.match(/\(x(\d+)\)$/)
        let count = match ? parseInt(match[1], 10) + 1 : 2

        await Log.findByIdAndUpdate(lastLog._id, {
          remarks: `(x${count})`.trim(),
        })

        return
      }
    }

    if (action === "User updated" && remarks && typeof remarks === "object") {
      console.log('remarks :>> ', remarks);
      await Log.create({
        email,
        action,
        remarks: JSON.stringify(remarks, null, 2),
      })
      return
    }

    await Log.create({ email, action, remarks })
  } catch (err) {
    console.error("Error while creating log:", err.message)
  }
}

module.exports = createLog
