/** Imports */
require("dotenv").config() /** Load environnement variables from .env file to process.env */

const helmet = require("helmet")
const express = require("express")
const mongoose = require("mongoose")
const rateLimiter = require("./middleware/rate-limiter")
const transactionsRoutes = require("./routes/transactions")
const accountsRoutes = require("./routes/accounts")

/** Create an express application */
const app = express()

/** MongoDB database connection */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_LINK)
    console.log("MongoDB connection success !")
     console.log("Connected to DB:", mongoose.connection.name)
  } catch (error) {
    console.log("MongoDB connection failed !")
  }
}

connectDB()

/** Middleware which intercepts all queries with JSON type and builds req.body (replaces body-parser) */
app.use(express.json())

/** Protect application by setting various HTTP headers (XSS, Clickjacking,...) but allowing images from 'same-site' */
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }))

/** Middleware for CORS headers */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL) /** Origins authorized */
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization") /** Some headers authorized */
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS") /** Some methods authorized */
  next() /** Go to next middleware */
})

/** Transactions routes */
app.use("/api/transactions", rateLimiter[1], transactionsRoutes)

/** Accounts routes */
app.use("/api/accounts", rateLimiter[1], accountsRoutes)

module.exports = app
