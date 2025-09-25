/** Import mongoose */
const mongoose = require("mongoose")

/** Create a mongoose Schema */
const recurringTransactionSchema = mongoose.Schema({
  accountId: { type: String, required: true },
  accountName: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  checkNumber: { type: String, required: false },
  debit: { type: Number, required: false },
  credit: { type: Number, required: false },
  label: { type: String, required: true },
  category: { type: String, required: false },
  subCategory: { type: String, required: false },
  destination: { type: String, required: false },
  periodicity: { type: String, required: false },
  notes: { type: String, required: false },
})

/** Model methods converts Schema in usable model */
module.exports = mongoose.model(
  "RecurringTransaction",
  recurringTransactionSchema
) /** 'RecurringTransaction' is the collection name which becomes 'RecurringTransactions' */
