
export const fetchAllCategories = async ()=>{
  try {
    const response = await fetch("http://localhost:3000/api/categories")
    if (!response.ok) throw new Error("Categories request failed")
    const data = await response.json()
    return data
  } catch (error) {
    console.error(
      `Error fetching categories data: ${error.message}`
    )
    throw error
  }
}

