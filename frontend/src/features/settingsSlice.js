import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  bankAccount: null,
  isTransactionEditWindowVisible: true,
  isRecurringEditWindowVisible: true,
  selectedTransactionIds: [],
  selectedRecurringTransactionIds: [],
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // BANK ACCOUNT
    setBankAccount: (state, action) => {
      state.bankAccount = action.payload
    },

    // TRANSACTION EDIT WINDOWS
    setIsTransactionEditWindowVisible: (state, action) => {
      state.isTransactionEditWindowVisible = action.payload
    },

    // RECURRING TRANSACTION EDIT WINDOWS
    setIsRecurringEditWindowVisible: (state, action) => {
      state.isRecurringEditWindowVisible = action.payload
    },

    // SELECTED TRANSACTIONS
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

    // SELECTED RECURRING TRANSACTION
    setSelectedRecurringTransactionIds(state, action) {
      state.selectedRecurringTransactionIds = action.payload
    },
    addSelectedRecurringTransactionId(state, action) {
      if (!state.selectedRecurringTransactionIds.includes(action.payload)) {
        state.selectedRecurringTransactionIds.push(action.payload)
      }
    },
    removeSelectedRecurringTransactionId(state, action) {
      state.selectedRecurringTransactionIds =
        state.selectedRecurringTransactionIds.filter(
          (id) => id !== action.payload
        )
    },
    clearSelectedRecurringTransactionIds(state) {
      state.selectedRecurringTransactionIds = []
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
  setSelectedRecurringTransactionIds,
  addSelectedRecurringTransactionId,
  removeSelectedRecurringTransactionId,
  clearSelectedRecurringTransactionIds,
} = settingsSlice.actions

export default settingsSlice.reducer
