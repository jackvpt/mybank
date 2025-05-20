/** Imports */
const express = require("express")
const router = express.Router()
// const auth = require("../middleware/auth")
// const multer = require("multer")
const transactionsCtrl = require("../controllers/transactions")

/** Set routes */

router.get("/", transactionsCtrl.getAllTransactions)

module.exports = router
