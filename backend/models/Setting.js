// 📦 Import mongoose
const mongoose = require("mongoose")

// 🧩 Sub-schema for types and periodicities
const labeledItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    text: { type: String, required: true },
    category: { type: String, required: true }, // Credit, debit or transfer
  },
  { _id: false },
) // No _id for array items

// 🏗️ Main schema for application settings
const settingsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: "global_settings",
    },
    types: {
      type: [labeledItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "The list of types cannot be empty",
      },
    },
    periodicities: {
      type: [labeledItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "The list of periodicities cannot be empty",
      },
    },
  },
  {
    collection: "settings", // Prevent Mongoose from pluralizing to "settingss"
    timestamps: true, // Adds createdAt and updatedAt fields
    strict: true, // Disallow undefined fields in documents
  },
)

/** Model methods converts Schema in usable model */
module.exports = mongoose.model(
  "Settings",
  settingsSchema,
) /** 'Setting' is the collection name which becomes 'Settings' */
