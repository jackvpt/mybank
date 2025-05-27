/** Imports */
const Category = require("../models/Category")

const fs = require("fs")

/** GET All Categories */
exports.getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find()
    res.status(200).json(allCategories)
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Error retrieving categories." })
  }
}
