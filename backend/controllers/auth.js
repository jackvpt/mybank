/** Imports */
const User = require("../models/User")
const Auth = require("../models/Auth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const createLog = require("../utils/Logger")
const { decodeExp } = require("../utils/dateTools")
const { isErrorPassword } = require("../utils/authTools")

/** SIGNUP new User + Auth */
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body

  /** Check required fields */
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." })
  }

  /** Check password validity */
  const errorPassword = isErrorPassword(password)
  if (errorPassword) {
    return res.status(400).json({
      error: errorPassword,
    })
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use." })
    }

    // Create the User
    const newUser = new User({
      firstName,
      lastName,
      email,
      role,
    })
    await newUser.save()

    // Hash the password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create the Auth entry
    const newAuth = new Auth({
      userId: newUser._id,
      passwordHash: passwordHash,
    })
    await newAuth.save()

    res.status(201).json({
      message: "User created successfully.",
      user: newUser,
    })
  } catch (error) {
    console.log("error/message :>> ", error.message)
    res.status(500).json({
      error: error.message || "Error creating user.",
    })
  }
}

/**
 * User login
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.login = async (req, res) => {
  console.log("Login connection trial :>> ", req.body.email)

  try {
    /** Find the user by email */
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      console.log("User not found")
      return res.status(401).json({ message: "UserID/Password incorrect" })
    }

    /** Find the Auth by userId */
    const auth = await Auth.findOne({ userId: user._id })
    if (!auth) {
      console.log("Auth not found for this user")
      return res.status(401).json({ message: "Auth not found for this user" })
    }

    /** Compare entered password with stored hash */
    const valid = await bcrypt.compare(req.body.password, auth.passwordHash)

    if (!valid) {
      console.log("Invalid password")
      return res.status(401).json({ message: "UserID/Password incorrect" })
    }

    /** Success: return token & user data */
    console.log(
      "Access granted :>> ",
      `${user.firstName} ${user.lastName} - ${user.role}`
    )

    await createLog(req.body.email, "Logged in")

    user.lastConnection = new Date()
    await user.save()

    res.status(200).json({
      user,
      token: jwt.sign(
        {
          userId: user._id,
          role: user.role,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: process.env.TOKEN_EXPIRATION || "7d" }
      ),
    })
  } catch (error) {
    console.error("Access denied :>> ", error)
    res.status(500).json({ error })
  }
}

/** DELETE User */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    await Auth.deleteOne({ userId: user._id }) // Delete the Auth entry
    await user.deleteOne() // Delete the user

    res.status(200).json({ message: "User and Auth deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/** VALIDATE token */
exports.validate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token provided")
      return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.SECRET_TOKEN)
    console.log("Token valid. Expiry time: ", decodeExp(decoded.exp))

    // Check if user exists
    const user = await User.findById(decoded.userId)

    if (!user) {
      console.log("User not found for this token")
      return res.status(401).json({ message: "Invalid token: user not found" })
    }

    // Update last connection date
    user.lastConnection = new Date()
    await user.save()

    await createLog(user.email, "Token validated")

    // Return user data
    res.status(200).json({
      user,
      expiry: decodeExp(decoded.exp),
    })
  } catch (error) {
    console.error("Token validation failed:", error.message)
    return res
      .status(500)
      .json({ message: "Invalid or expired token - Access denied" })
  }
}

/** UPDATE User Password */
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  try {
    // Check required fields
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new password are required." })
    }

    // Check new password validity
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        error:
          "Password is not valid (8 characters min, 1 uppercase, 1 lowercase, 1 number, 1 special char).",
      })
    }

    // Check token & get userId
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" })
    }
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN)

    // Get user & auth
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const auth = await Auth.findOne({ userId: user._id })
    if (!auth) {
      return res.status(404).json({ message: "Auth not found for this user" })
    }

    // Check if current password is valid
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      auth.passwordHash
    )
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" })
    }

    // Hash and update to new password
    const saltRounds = 10
    auth.passwordHash = await bcrypt.hash(newPassword, saltRounds)
    await auth.save()

    await createLog(user.email, "Password updated")

    res.status(200).json({ message: "Password updated successfully." })
  } catch (error) {
    console.error("Password update failed:", error.message)
    res.status(500).json({ error: error.message || "Error updating password" })
  }
}

/** REQUEST forgotten password reset (with Brevo) */
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body
  console.log("Password reset request for email :>> ", email)

  try {
    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      console.log("User not found for this email")
      return res.status(404).json({ message: "User not found" })
    }

    // Retrieve preferred language or default to 'en'
    const lang = user.settings?.preferredLanguage || "en"

    // Create a JWT token valid for 1 hour
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
      expiresIn: "1h",
    })
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 1)

    console.log(
      `Password reset token (valid until ${expiryDate.toISOString()}): `,
      token
    )

    // Generate the full link for the frontend
    const resetLink = new URL(
      `/reset-password/${token}`,
      process.env.FRONTEND_URL
    ).toString()

    // Initialize Brevo SDK
    const SibApiV3Sdk = require("sib-api-v3-sdk")
    const defaultClient = SibApiV3Sdk.ApiClient.instance
    const apiKey = defaultClient.authentications["api-key"]
    apiKey.apiKey = process.env.BREVO_API_KEY

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    // Prepare email
    const sendSmtpEmail = {
      to: [{ email: user.email, name: user.firstName }],
      templateId: 1, // Use the ID of the email template created in Brevo
      params: {
        FIRSTNAME: user.firstName || "",
        LASTNAME: user.lastName || "",
        RESETLINK: resetLink,
        EXPIRYTIME: expiryDate.toLocaleString(),
      },
    }

    // Send email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log("Email sent! ID:", response.messageId)

    // Log
    await createLog(user.email, "Password reset requested")

    // API response
    return res.json({ message: "Reset link sent to email" })
  } catch (error) {
    console.error(
      "Password reset request failed:",
      error.response?.body || error.message
    )
    res.status(500).json({ message: "Server error" })
  }
}

/** RESET password using token */
exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body

  console.log("Password reset")

  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" })
    }
    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN)
    const user = await User.findById(decoded.userId)

    console.log("User email :>> ", user?.email)
    if (!user) {
      console.log("User not found for this token")
      return res.status(404).json({ message: "User not found" })
    }

    // Validate new password
    if (!isValidPassword(newPassword)) {
      console.log("New password not valid")
      return res.status(400).json({
        error:
          "Password is not valid (8 characters min, 1 uppercase, 1 lowercase, 1 number, 1 special char).",
      })
    }

    // Find auth entry
    const auth = await Auth.findOne({ userId: user._id })
    if (!auth) return res.status(400).json({ message: "Invalid request" })

    // Hash and update
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    auth.passwordHash = hashedPassword
    await auth.save()

    console.log("Password successfully reset for user:", user.email)
    await createLog(user.email, "Password reset")

    res.json({ message: "Password successfully reset" })
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" })
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid token" })
    }
    console.error("Password reset failed:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
