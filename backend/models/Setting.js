/** Import mongoose */
const mongoose = require("mongoose")

/** Create a mongoose Schema */
const settingSchema = mongoose.Schema({
  types: {
    type: [
      {
        name: { type: String, required: true },
        text: { type: String, required: true }
      }
    ],
    required: true,
    validate: [arr => arr.length > 0, 'The list of types cannot be empty']
  }
})

/** Model methods converts Schema in usable model */
module.exports = mongoose.model("Settings", settingSchema) /** 'Transaction' is the collection name which becomes 'Transactions' */

