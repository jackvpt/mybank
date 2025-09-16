/** Import mongoose */
const mongoose = require("mongoose")

/** Create a mongoose Schema */
const LogSchema = mongoose.Schema({
  email: String,
  action: String,
  remarks: String,
  date: { type: Date, default: Date.now }
})

/** Model methods converts Schema in usable model */
module.exports = mongoose.model(
  "Log",
  LogSchema
) /** 'Log' is the collection name which becomes 'Logs' */
