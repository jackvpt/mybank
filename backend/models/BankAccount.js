/** Import mongoose */
const mongoose = require("mongoose")

/** Create a mongoose Schema */
const bankAccountSchema = mongoose.Schema({
  name: { type: String, required: true },
  bankName: { type: String, required: true },
  bankAbbreviation: { type: String, required: true },
  iban: { type: String, required: false },
  bic: { type: String, required: false },
  initialBalance: { type: Number, required: true },
  currentBalance: { type: Number, required: true },
  lastCheckDate: { type: Date, required: false },
  lastCheckBalance: { type: Number, required: false },
  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: false },
})

/** Model methods converts Schema in usable model */
module.exports = mongoose.model(
  "BankAccount",
  bankAccountSchema
) /** 'BankAccount' is the collection name which becomes 'BankAccounts' */
