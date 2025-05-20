/** Import express-rate-limit */
const rateLimit = require("express-rate-limit")

const limiterFB = rateLimit({
  windowMs: 15 * 60 * 1000 /** 15 minutes delay */,
  max: 5 /** Requests limit by delay period */,
  message: "Too many requests. Retry later !",
  standardHeaders: true,
})

const limiterDdos = rateLimit({
  windowMs: 15 * 60 * 1000 /** 15 minutes delay */,
  max: 500 /** Requests limit by delay period */,
  message: "Too many requests. Retry later !",
  standardHeaders: true,
})

module.exports = [limiterFB, limiterDdos]
