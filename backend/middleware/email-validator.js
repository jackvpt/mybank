/** Import express-validator */
const { body, validationResult } = require('express-validator')

module.exports = [
  body('email').isEmail().withMessage("Email address is not valid !"),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Email address is not valid !" })
    }

    next()
  }
]