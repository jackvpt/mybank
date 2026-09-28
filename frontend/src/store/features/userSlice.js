import { createSlice } from "@reduxjs/toolkit"

/**
 * Initial state of the user slice.
 * Every field is null while no user is logged in.
 */
const initialState = {
  id: null,
  firstName: null,
  lastName: null,
  fullName: null,
  email: null,
  role: null,
  lastConnection: null, // stored as an ISO string to stay serializable
}

/**
 * Redux slice for user information.
 *
 * Handles storing the logged-in user's data and clearing it on logout.
 * This slice is persisted with redux-persist (see store config).
 */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Store the logged-in user's information.
     *
     * @param {object} state - Current slice state
     * @param {object} action - Redux action
     * @param {object} action.payload - User data object
     * @param {string|number} action.payload.id - User ID
     * @param {string} action.payload.firstName - First name
     * @param {string} action.payload.lastName - Last name
     * @param {string} action.payload.fullName - Full name
     * @param {string} action.payload.email - Email address
     * @param {string} action.payload.role - User role
     * @param {string} action.payload.lastConnection - Last connection timestamp (ISO string)
     */
    setUser: (state, action) => {
      state.id = action.payload.id
      state.firstName = action.payload.firstName
      state.lastName = action.payload.lastName
      state.fullName = action.payload.fullName
      state.email = action.payload.email
      state.role = action.payload.role
      state.lastConnection = action.payload.lastConnection
    },

    /**
     * Clear all user data and reset the slice to its initial state.
     * Also used by the root reducer to wipe the whole store on logout.
     */
    clearUser: () => initialState,
  },
})

// Export actions for dispatch
export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer