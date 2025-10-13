import { createSlice } from "@reduxjs/toolkit"

export const initialState = {
  bankAccount: { name: null, id: null, initialBalance: null },
  isTransactionEditWindowVisible: true,
  isRecurringEditWindowVisible: true,
  isCheckTransactionsEditWindowVisible: false,
  selectedTransactionsIds: [],
  selectedRecurringTransactionsIds: [],
  selectedCheckTransactionsIds: [],
  transactionsTableScrollPosition: null,
  newTransactionId: null,
  checking: {
    sorting: { order: "asc", orderBy: "date" },
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
      state.bankAccount.name = action.payload.name
      state.bankAccount.id = action.payload.id
      state.bankAccount.initialBalance = action.payload.initialBalance
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

    setSelectedTransactionsIds(state, action) {
      const ids = action.payload

      if (ids.length > 1) {
        state.selectedTransactionsIds = ids
      } else {
        const id = ids[0]
        if (state.selectedTransactionsIds.includes(id)) {
          state.selectedTransactionsIds = []
        } else {
          state.selectedTransactionsIds = [id]
        }
      }
    },

    addSelectedTransactionsIds(state, action) {
      if (!state.selectedTransactionsIds.includes(action.payload)) {
        state.selectedTransactionsIds.push(action.payload)
      }
    },
    removeSelectedTransactionsIds(state, action) {
      state.selectedTransactionsIds = state.selectedTransactionsIds.filter(
        (id) => id !== action.payload
      )
    },
    clearSelectedTransactionsIds(state) {
      state.selectedTransactionsIds = []
    },

    // SELECTED RECURRING TRANSACTION
    setSelectedRecurringTransactionsIds(state, action) {
      state.selectedRecurringTransactionsIds = action.payload
    },
    addSelectedRecurringTransactionsIds(state, action) {
      if (!state.selectedRecurringTransactionsIds.includes(action.payload)) {
        state.selectedRecurringTransactionsIds.push(action.payload)
      }
    },
    removeSelectedRecurringTransactionsIds(state, action) {
      state.selectedRecurringTransactionsIds =
        state.selectedRecurringTransactionsIds.filter(
          (id) => id !== action.payload
        )
    },
    clearSelectedRecurringTransactionsIds(state) {
      state.selectedRecurringTransactionsIds = []
    },

    // SELECT CHECK TRANSACTION
    setSelectedCheckTransactionsIds(state, action) {
      state.selectedCheckTransactionsIds = action.payload
    },
    clearSelectedCheckTransactionsIds(state) {
      state.selectedCheckTransactionsIds = []
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
    setCheckingSorting(state, action) {
      state.checking.sorting = action.payload
    },
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
  setSelectedTransactionsIds,
  addSelectedTransactionsIds,
  removeSelectedTransactionsIds,
  clearSelectedTransactionsIds,
  setSelectedRecurringTransactionsIds,
  addSelectedRecurringTransactionsIds,
  removeSelectedRecurringTransactionsIds,
  clearSelectedRecurringTransactionsIds,
  setSelectedCheckTransactionsIds,
  clearSelectedCheckTransactionsIds,
  setTransactionsTableScrollPosition,
  setNewTransactionId,
  setCheckingSorting,
  setCheckingDate,
  setCheckingInitialAmount,
  setCheckingFinalAmount,
  setCheckingCurrentAmount,
  setNoneTransactionChecked,
} = parametersSlice.actions

export default parametersSlice.reducer
