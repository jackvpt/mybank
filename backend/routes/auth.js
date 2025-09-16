/** Imports */
const express = require("express")
const router = express.Router()
const multer = require("multer")
const authCtrl = require("../controllers/auth")

/** Set routes */
router.post("/signup", authCtrl.signup)
router.post("/login", authCtrl.login)
router.get("/validate", authCtrl.validate)
router.put("/update-password", authCtrl.updatePassword)

// Password reset
router.post("/request-password-reset", authCtrl.requestPasswordReset)
router.post("/reset-password", authCtrl.resetPassword)

module.exports = router
