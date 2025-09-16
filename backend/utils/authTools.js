import jwt from "jsonwebtoken"
import User from "../models/User.js"

/**
 * Get user from JWT token.
 * @param {string} authHeader - The Authorization header "Bearer <token>"
 * @returns {Promise<Object>} - The user without the password
 */
export const getUserFromToken = async (authHeader) => {
  if (!authHeader) throw new Error("No token provided")

  const token = authHeader.split(" ")[1]
  if (!token) throw new Error("Token malformed")

  const decoded = jwt.verify(token, process.env.SECRET_TOKEN)
  const user = await User.findById(decoded.userId).select("-password")
  if (!user) throw new Error("User not found")

  return user
}

/**
 * Check if the password is valid.
 * @param {string} password - The password to validate.
 * @returns {string} - An error message if invalid, or an empty string if valid.
 */
export const isErrorPassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)

  if (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars
  )
    return null
  else
    return "Password is not valid (8 caracters mini, 1 uppercase, 1 lowercase, 1 number, 1 special car) !"
}
