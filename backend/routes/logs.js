/** Imports */
const express = require("express")
const router = express.Router()
const logsCtrl = require("../controllers/logs")

/** Set routes */
router.get("/", logsCtrl.getAllLogs)

module.exports = router
