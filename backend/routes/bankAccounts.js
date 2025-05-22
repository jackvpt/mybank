/** Imports */
const express = require("express")
const router = express.Router()
// const auth = require("../middleware/auth")
const multer = require("multer")
const bankAccountsCtrl = require("../controllers/bankAccounts")

/** Set routes */

router.get("/", bankAccountsCtrl.getAllBankAccounts)
router.put("/:id", multer().none(), bankAccountsCtrl.updateBankAccount)

module.exports = router
