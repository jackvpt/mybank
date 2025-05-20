/** Imports */
const express = require("express")
const router = express.Router()
// const auth = require("../middleware/auth")
// const multer = require("multer")
const accountsCtrl = require("../controllers/accounts")

/** Set routes */

router.get("/", accountsCtrl.getAllAccounts)

module.exports = router
