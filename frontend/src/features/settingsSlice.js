import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  bankAccount: null,
  isEditWindowVisible:true
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setBankAccount: (state, action) => {
      state.bankAccount = action.payload
    },
    setIsEditWindowVisible: (state, action) => {
      state.isEditWindowVisible = action.payload
    },
  },
})

export const { setBankAccount,setIsEditWindowVisible } = settingsSlice.actions

export default settingsSlice.reducer
