import { API_URL } from "./apiURL"

// Base URL for authentication-related endpoints
const BASE_URL = `${API_URL}/settings`

export const fetchAllSettings = async ()=>{
  try {
    const response = await fetch(`${BASE_URL}`)
    if (!response.ok) throw new Error("Settings request failed")
    const data = await response.json()
    return data
  } catch (error) {
    console.error(
      `Error fetching settings data: ${error.message}`
    )
    throw error
  }
}

