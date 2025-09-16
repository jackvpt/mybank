import { API_URL } from "./apiURL"

// Base URL for authentication-related endpoints
const BASE_URL = `${API_URL}/categories`

/**
 * Sorts categories by type and name.
 * @function sortCategories
 * @description This function sorts an array of categories first by type (debit then credit) and then by name in a case-insensitive manner.
 * @param {Array} categories
 * @returns
 */
const sortCategories = (categories) => {
  categories.sort((a, b) => {
    // Sort categories by type first (debit then credit)
    if (a.type !== b.type) {
      return a.type === "debit" ? -1 : 1
    }
    // Then sort by name in a case-insensitive manner
    return a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
  })
  return categories
}

/**
 * Fetches all categories from the API.
 * @function fetchAllCategories
 * @description This function retrieves all categories from the API endpoint.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of categories.
 */
export const fetchAllCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}`)
    if (!response.ok) throw new Error("Categories request failed")
    const data = await response.json()
    return sortCategories(data)
  } catch (error) {
    console.error(`Error fetching categories data: ${error.message}`)
    throw error
  }
}