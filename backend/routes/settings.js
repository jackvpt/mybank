/** Imports */
const express = require("express")
const router = express.Router()
// const auth = require("../middleware/auth")
const multer = require("multer")
const settingsCtrl = require("../controllers/settings")

/** Set routes */

router.get("/", settingsCtrl.getAllSettings)

module.exports = router
