/**
 * Convert a message to a more user-friendly format.
 * @param {string} message 
 * @returns {string}
 */
export const messageConverter = (message) => {
  if (!message) return
  switch (message) {
    case "Network error: Could not reach the server.":
      return "Impossible de se connecter au serveur"
    default:
      return message
  }
}
