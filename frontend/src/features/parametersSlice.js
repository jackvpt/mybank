import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  bankAccount: {  name: null, id: null },
  isTransactionEditWindowVisible: true,
  isRecurringEditWindowVisible: true,
  isCheckTransactionsEditWindowVisible: false,
  selectedTransactionIds: [],
  selectedRecurringTransactionIds: [],
  selectedCheckTransactionIds: [],
  transactionsTableScrollPosition: null,
  newTransactionId: null,
  checking: {
    date: new Date(),
    initialAmount: 0,
    finalAmount: 0,
    currentAmount: 0,
    noneTransactionChecked: true,
  },
}

const parametersSlice = createSlice({
  name: "parameters",
  initialState,
  reducers: {
    // BANK ACCOUNT
    setBankAccount: (state, action) => {
      console.log('payload :>> ', action.payload);
      state.bankAccount.name = action.payload.name
      state.bankAccount.id = action.payload.id
    },

    // TRANSACTION EDIT WINDOWS
    setIsTransactionEditWindowVisible: (state, action) => {
      state.isTransactionEditWindowVisible = action.payload
    },

    // RECURRING TRANSACTION EDIT WINDOWS
    setIsRecurringEditWindowVisible: (state, action) => {
      state.isRecurringEditWindowVisible = action.payload
    },

    // CHECK TRANSACTION EDIT WINDOWS
    setIsCheckTransactionsEditWindowVisible: (state, action) => {
      state.isCheckTransactionsEditWindowVisible = action.payload
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

    // SELECT CHECK TRANSACTION
    setSelectedCheckTransactionIds(state, action) {
      state.selectedCheckTransactionIds = action.payload
    },
    clearSelectedCheckTransactionIds(state) {
      state.selectedCheckTransactionIds = []
    },

    // TRANSACTION TABLE SCROLL STATUS
    setTransactionsTableScrollPosition(state, action) {
      state.transactionsTableScrollPosition = action.payload
    },

    // NEW TRANSACTION ID
    setNewTransactionId(state, action) {
      state.newTransactionId = action.payload
    },

    // CHECKING ACCOUNT PARAMETERS
    setCheckingDate(state, action) {
      state.checking.date = action.payload
    },
    setCheckingInitialAmount(state, action) {
      state.checking.initialAmount = action.payload
    },
    setCheckingFinalAmount(state, action) {
      state.checking.finalAmount = action.payload
    },
    setCheckingCurrentAmount(state, action) {
      state.checking.currentAmount = action.payload
    },
    setNoneTransactionChecked(state, action) {
      state.checking.noneTransactionChecked = action.payload
    },
  },
})

export const {
  setBankAccount,
  setIsTransactionEditWindowVisible,
  setIsRecurringEditWindowVisible,
  setIsCheckTransactionsEditWindowVisible,
  setSelectedTransactionIds,
  addSelectedTransactionId,
  removeSelectedTransactionId,
  clearSelectedTransactionIds,
  setSelectedRecurringTransactionIds,
  addSelectedRecurringTransactionId,
  removeSelectedRecurringTransactionId,
  clearSelectedRecurringTransactionIds,
  setSelectedCheckTransactionIds,
  clearSelectedCheckTransactionIds,
  setTransactionsTableScrollPosition,
  setNewTransactionId,
  setCheckingDate,
  setCheckingInitialAmount,
  setCheckingFinalAmount,
  setCheckingCurrentAmount,
  setNoneTransactionChecked
} = parametersSlice.actions

export default parametersSlice.reducer
