/** Imports */
const http = require("http")
const app = require("./app")

const normalizePort = val => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

/** Return valid port */
const port = normalizePort(process.env.PORT || "4300")
app.set("port", port)

/** Manage errors */
const errorHandler = error => {
  if (error.syscall !== "listen") {
    throw error
  }
  const address = server.address()
  const bind = typeof address === "string" ? "pipe " + address : "port: " + port
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.")
      process.exit(1)
      break
    case "EADDRINUSE":
      console.error(bind + " is already in use.")
      process.exit(1)
      break
    default:
      throw error
  }
}

/** app.js is called at each server call */
const server = http.createServer(app)

server.on("error", errorHandler)
server.on("listening", () => {
  const address = server.address()
  const bind = typeof address === "string" ? "pipe " + address : "port " + port
  console.log("Listening on " + bind)
})

server.listen(port)
