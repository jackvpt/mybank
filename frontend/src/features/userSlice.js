import { createSlice } from "@reduxjs/toolkit"

/**
 * Initial state of the user slice
 */
const initialState = {
  userId: null,
  firstName: null,
  lastName: null,
  fullName: null,
  email: null,
  role: null,
  lastConnection: null,
}

/**
 * Redux slice for user information and settings
 *
 * Handles storing user data, clearing user state, and updating user settings.
 */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Set the user information
     * @param {object} action.payload - User data object
     * @param {string|number} action.payload.userId - User ID
     * @param {string} action.payload.firstName - First name
     * @param {string} action.payload.lastName - Last name
     * @param {string} action.payload.email - Email address
     * @param {string} action.payload.role - User role
     * @param {string} action.payload.lastConnection - Last connection timestamp
     */
    setUser: (state, action) => {
      state.userId = action.payload.userId
      state.firstName = action.payload.firstName
      state.lastName = action.payload.lastName
      state.fullName = action.payload.fullName
      state.email = action.payload.email
      state.role = action.payload.role
      state.lastConnection = action.payload.lastConnection
    },

    /**
     * Clear all user data and reset to initial state
     */
    clearUser: () => {
      return { ...initialState }
    },
  },
})

// Export actions for dispatch
export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer
