import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  bankAccount: null,
  isEditWindowVisible: true,
  selectedTransactionId: null,
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
    selectTransactionId(state, action) {
      state.selectedTransactionId = action.payload
    },
    clearSelectedTransactionId(state) {
      state.selectedTransactionId = null
    },
  },
})

export const {
  setBankAccount,
  setIsEditWindowVisible,
  selectTransactionId,
  clearSelectedTransactionId,
} = settingsSlice.actions

export default settingsSlice.reducer
