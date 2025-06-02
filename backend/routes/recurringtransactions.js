/** Imports */
const express = require("express")
const router = express.Router()
// const auth = require("../middleware/auth")
const multer = require("multer")
const recurringTransactionsCtrl = require("../controllers/recurringTransactions")

/** Set routes */

router.get("/", recurringTransactionsCtrl.getAllRecurringTransactions)
router.post("/",multer().none(), recurringTransactionsCtrl.createRecurringTransaction)
router.put("/:id", multer().none(), recurringTransactionsCtrl.updateRecurringTransaction)
router.delete("/:id", recurringTransactionsCtrl.deleteRecurringTransaction)

module.exports = router
