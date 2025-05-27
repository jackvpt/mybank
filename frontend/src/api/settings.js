
export const fetchAllSettings = async ()=>{
  try {
    const response = await fetch("http://localhost:3000/api/settings")
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

