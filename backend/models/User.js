/** Imports */
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

/** Create Schema */
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  privileges: { type: String, required: false },
  createdAt: { type: Date, required: true },
  lastConnection: { type: Date, required: true },
})

/** Check if Schema is unique */
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)
