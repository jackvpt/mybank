/** Imports */
const express = require("express")
const router = express.Router()
// const auth = require("../middleware/auth")
const multer = require("multer")
const transactionsCtrl = require("../controllers/transactions")

/** Set routes */

router.get("/", transactionsCtrl.getAllTransactions)
router.post("/",multer().none(), transactionsCtrl.createTransaction)
router.put("/:id", multer().none(), transactionsCtrl.updateTransaction)
router.delete("/:id", transactionsCtrl.deleteTransaction)
router.post("/bulk-delete", transactionsCtrl.deleteTransactions);
router.patch("/validate", transactionsCtrl.validateTransactions);


module.exports = router
