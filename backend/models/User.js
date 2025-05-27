/** Imports */
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

/**
 * User Schema
 * @typedef {Object} User
 * @property {String} firstName - User's first name
 * @property {String} lastName - User's last name
 * @property {String} email - User's email address
 * @property {String} password - User's password
 * @property {String} privileges - User's privileges (e.g., admin, user)
 * @property {Date} createdAt - Date when the user was created
 * @property {Date} lastConnection - Date of the user's last connection
 */
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  privileges: { type: String, required: true, default: "user" }, // Default privilege is 'user'
  createdAt: { type: Date, required: true, default: Date.now },
  lastConnection: { type: Date, required: false },
})

/** Check if Schema is unique */
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)
