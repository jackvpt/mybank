import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  bankAccount: null,
  isEditWindowVisible: true,
  selectedTransactionId: null,
  selectedRecurringTransactionId: null,
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
  setIsEditWindowVisible,
  selectTransactionId,
  clearSelectedTransactionId,
  selectRecurringTransactionId,
  clearSelectedRecurringTransactionId,
} = settingsSlice.actions

export default settingsSlice.reducer
