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

/**
 * Converts a Date object to a custom string format.
 *
 * @param {Date} value - The date to format.
 * @returns {string|null} The formatted date string or null if invalid.
 * @example
 * dateToCustom(new Date("2023-10-05T14:30:00")) // returns "05/10/2023 14:30"
 * dateToCustom("2023-10-05T14:30:00") // returns "05/10/2023 14:30"
 * dateToCustom(null) // returns null
 * dateToCustom("invalid date") // returns null
 */
export const dateToCustom = (value) => {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value)
  if (isNaN(date)) return null

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0") // Janvier = 0
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/**
 * 
 * @param {Date} date 
 * @returns {Date} New date with one month added
 */
export const addOneMonth = (date) => {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + 1)
  return newDate
}
