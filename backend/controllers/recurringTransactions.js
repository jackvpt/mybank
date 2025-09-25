/** Imports */
const RecurringTransaction = require("../models/RecurringTransaction")

const fs = require("fs")

/** GET All Recurring Transactions */
exports.getAllRecurringTransactions = async (req, res) => {
  try {
    const allRecurringTransactions = await RecurringTransaction.find()
    res.status(200).json(allRecurringTransactions)
    console.log(`${allRecurringTransactions.length} recurring transactions retrieved`)
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Error retrieving recurring transactions." })
  }
}

/** POST New Recurring Transaction */
exports.createRecurringTransaction = async (req, res) => {
  const recurringTransactionObject = req.body

  try {
    const recurringTransaction = new RecurringTransaction({
      ...recurringTransactionObject,
    })

    await recurringTransaction.save()
    res.status(201).json(recurringTransaction)
    console.log(
      `Recurring transaction created: ${recurringTransaction._id} - ${recurringTransaction.label}`
    )
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Error adding recurring transaction!" })
  }
}

/** PUT Update Transaction */
exports.updateRecurringTransaction = async (req, res) => {
  const recurringTransactionObject = req.body

  try {
    const updatedRecurringTransaction = await RecurringTransaction.findByIdAndUpdate(
      req.params.id,
      { ...recurringTransactionObject, _id: req.params.id },
      { new: true }
    )
    res.status(200).json(updatedRecurringTransaction)
    console.log(
      `Recurring transaction updated: ${updatedRecurringTransaction._id} - ${updatedRecurringTransaction.label}`
    )
  } catch (error) {
    res.status(401).json({ error })
  }
}

/** DELETE One Recurring transaction */
exports.deleteRecurringTransaction = async (req, res) => {
  try {
    await RecurringTransaction.deleteOne({ _id: req.params.id })
    res.status(200).json({ message: "Recurring transaction deleted successfully!" })
    console.log(`Recurring transaction deleted: ${req.params.id}`)
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Error deleting recurring transaction!" })
  }
}

/** DELETE Multiple Recurring Transactions */
exports.deleteRecurringTransactions = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "A non-empty array of IDs is required." });
  }

  try {
    const result = await RecurringTransaction.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      message: "Recurring transactions deleted successfully!",
      deletedCount: result.deletedCount,
    });

    console.log(`Deleted ${result.deletedCount} recurring transactions: ${ids.join(", ")}`);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Error deleting recurring transactions!",
    });
  }
};
