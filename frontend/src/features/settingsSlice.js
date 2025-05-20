import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  bankAccount: null, // ou une valeur par défaut
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setBankAccount: (state, action) => {
      state.bankAccount = action.payload
    },
  },
})

export const { setBankAccount } = settingsSlice.actions

export default settingsSlice.reducer
