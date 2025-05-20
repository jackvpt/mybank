/** Imports */
require("dotenv").config()
const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1] /** Token is composed of "Bearer " + 'token' */
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN) /** Decodes token with secret key (same as in controller/user.js) */
        const userId = decodedToken.userId /** Get userID */
        req.auth = { userId: userId }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}