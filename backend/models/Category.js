/** Import mongoose */
const mongoose = require("mongoose")

/** Create a mongoose Schema */
const categorySchema = mongoose.Schema({
  category: { type: String, required: true },
  subcategories: [{ type: String }],
})

/** Model methods converts Schema in usable model */
module.exports = mongoose.model("Categories", categorySchema) /** 'Transaction' is the collection name which becomes 'Transactions' */

