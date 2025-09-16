/** Imports */
const express = require("express")
const router = express.Router()
// const auth = require("../middleware/auth")
const multer = require("multer")
const categoriesCtrl = require("../controllers/categories")

/** Set routes */
router.get("/", categoriesCtrl.getAllCategories)

module.exports = router
