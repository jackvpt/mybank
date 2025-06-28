/**
 * Converts a string to a formatted amount.
 * If the input is not a string or cannot be converted to a number, it returns null
 * @param {String} str
 * @returns {Number|null} The formatted number or null if conversion fails
 * @example
 * stringToAmount("1,234.56") // returns 1234.56
 * stringToAmount("abc") // returns null
 * stringToAmount("  1234.56  ") // returns 1234.56
 * stringToAmount("1,234") // returns 1234
 */
export const stringToAmount = (str) => {
  if (typeof str !== "string") return null

  const value = str.trim().replace(",", ".")
  const number = parseFloat(value)

  const result = isNaN(number) ? null : number
  return result
}