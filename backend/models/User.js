/** Import mongoose */
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

/** Create a mongoose Schema */
const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "admin" }, // e.g., "user", "admin", "super-admin"
  lastConnection: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

/** Check if Schema is unique */
UserSchema.plugin(uniqueValidator)

/** Model methods converts Schema in usable model */
module.exports = mongoose.model(
  "User",
  UserSchema
) /** 'User' is the collection name which becomes 'Users' */
