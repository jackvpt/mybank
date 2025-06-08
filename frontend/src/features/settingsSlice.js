import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  bankAccount: null,
  isTransactionEditWindowVisible: true,
  isRecurringEditWindowVisible: true,
  selectedTransactionIds: [],
  selectedRecurringTransactionId: null,
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setBankAccount: (state, action) => {
      state.bankAccount = action.payload
    },
    setIsTransactionEditWindowVisible: (state, action) => {
      state.isTransactionEditWindowVisible = action.payload
    },
    setIsRecurringEditWindowVisible: (state, action) => {
      state.isRecurringEditWindowVisible = action.payload
    },
    selectTransactionId(state, action) {
      state.selectedTransactionId = action.payload
    },
    clearSelectedTransactionId(state) {
      state.selectedTransactionId = null
    },
    selectRecurringTransactionId(state, action) {
      state.selectedRecurringTransactionId = action.payload
    },
    clearSelectedRecurringTransactionId(state) {
      state.selectedRecurringTransactionId = null
    },
  },
})

export const {
  setBankAccount,
  setIsTransactionEditWindowVisible,
  setIsRecurringEditWindowVisible,
  selectTransactionId,
  clearSelectedTransactionId,
  selectRecurringTransactionId,
  clearSelectedRecurringTransactionId,
} = settingsSlice.actions

export default settingsSlice.reducer
