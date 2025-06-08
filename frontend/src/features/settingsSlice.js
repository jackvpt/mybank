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
    setSelectedTransactionIds(state, action) {
      state.selectedTransactionIds = action.payload
    },
    addSelectedTransactionId(state, action) {
      if (!state.selectedTransactionIds.includes(action.payload)) {
        state.selectedTransactionIds.push(action.payload)
      }
    },
    removeSelectedTransactionId(state, action) {
      state.selectedTransactionIds = state.selectedTransactionIds.filter(
        (id) => id !== action.payload
      )
    },
    clearSelectedTransactionIds(state) {
      state.selectedTransactionIds = []
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
  setSelectedTransactionIds,
  addSelectedTransactionId,
  removeSelectedTransactionId,
  clearSelectedTransactionIds,
  selectRecurringTransactionId,
  clearSelectedRecurringTransactionId,
} = settingsSlice.actions

export default settingsSlice.reducer
