/** Imports */
const express = require("express")
const router = express.Router()
// const auth = require("../middleware/auth")
const multer = require("multer")
const accountsCtrl = require("../controllers/accounts")

/** Set routes */

router.get("/", accountsCtrl.getAllAccounts)
router.put("/:id", multer().none(), accountsCtrl.updateAccount)

module.exports = router
