/** Import mongoose */
const mongoose = require("mongoose")

/** Create a mongoose Schema */
const AuthSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

/** Model methods converts Schema in usable model */
module.exports = mongoose.model(
  "Auth",
  AuthSchema
) /** 'Auth' is the collection name which becomes 'Auths' */
