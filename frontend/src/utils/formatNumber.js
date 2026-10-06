// Round on the absolute value so negatives round symmetrically
// ("+ 0" turns -0 into 0)
const round2 = (n) =>
  Math.sign(n) * (Math.round((Math.abs(n) + Number.EPSILON) * 100) / 100) + 0

/**
 * Converts a string or a number to a number rounded to 2 decimals.
 * Accepts "," or "." as decimal separator, ignores spaces (including
 * non-breaking ones) and currency symbols. Returns null if conversion fails.
 * @param {string|number} value
 * @returns {number|null}
 * @example
 * entityToAmount("1234.5")      // 1234.5
 * entityToAmount("1 234,56 €")  // 1234.56
 * entityToAmount("1,234.56")    // 1234.56
 * entityToAmount("12,5")        // 12.5
 * entityToAmount("-12.345")     // -12.35
 * entityToAmount(12.345)        // 12.35
 * entityToAmount("abc")         // null
 * entityToAmount("")            // null
 */
export const entityToAmount = (value) => {
  // Numbers: only reject NaN / Infinity
  if (typeof value === "number") {
    return Number.isFinite(value) ? round2(value) : null
  }
  if (typeof value !== "string") return null

  // Keep only digits, separators and minus sign
  let str = value.replace(/[\s\u00a0\u202f]/g, "").replace(/[^\d.,-]/g, "")
  if (!/\d/.test(str)) return null

  // The last separator is the decimal one, any other is a thousands separator
  const decimalIndex = Math.max(str.lastIndexOf(","), str.lastIndexOf("."))
  if (decimalIndex !== -1) {
    const intPart = str.slice(0, decimalIndex).replace(/[.,]/g, "")
    str = `${intPart}.${str.slice(decimalIndex + 1)}`
  }

  const number = Number(str)
  return Number.isNaN(number) ? null : round2(number)
}

/**
 * Formats a string or number as a monetary amount with 2 decimal places.
 * Returns an empty string if the value is null or cannot be converted to a number.
 * @param {string|number} value 
 * @returns {string} A string representation of the amount with 2 decimal places, or an empty string if the value is null or cannot be converted to a number.
 * @example
 * formatAmount("1234.5")      // "1234.50"
 */
export const formatAmount = (value)=>{
  const amount=entityToAmount(value)
  return !amount ? "" : amount.toFixed(2)
}

/**
 * Converts a Date object to a custom string format.
 *
 * @param {Date} value - The date to format.
 * @returns {string|null} The formatted date string or null if invalid.
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
