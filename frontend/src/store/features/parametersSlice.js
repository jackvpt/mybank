import { createSlice } from "@reduxjs/toolkit"

/**
 * Initial state of the parameters slice.
 * Holds UI state (window visibility, selections, scroll position)
 * and the parameters of the account checking feature.
 */
const initialState = {
  // Currently selected bank account
  bankAccount: { name: null, id: null },

  // Edit windows visibility
  isTransactionEditWindowVisible: true,
  isRecurringEditWindowVisible: true,
  isCheckTransactionsEditWindowVisible: false,

  // Selected rows in the tables
  selectedTransactionIds: [],
  selectedRecurringTransactionIds: [],
  selectedCheckTransactionIds: [],

  // Scroll position of the transactions table (null = not set)
  transactionsTableScrollPosition: null,

  // ID of the transaction just created (used to highlight / scroll to it)
  newTransactionId: null,

  // Account checking parameters
  checking: {
    date: new Date().toISOString(), // ISO string to stay serializable
    initialAmount: 0,
    finalAmount: 0,
    currentAmount: 0,
    noneTransactionChecked: true,
  },
}

/**
 * Redux slice for UI parameters.
 *
 * Handles the selected bank account, edit windows visibility,
 * table selections, scroll position and checking parameters.
 */
const parametersSlice = createSlice({
  name: "parameters",
  initialState,
  reducers: {
    // ─── BANK ACCOUNT ───────────────────────────────────────────────

    /**
     * Set the selected bank account.
     * @param {{ name: string, id: string|number }} action.payload
     */
    setBankAccount: (state, action) => {
      state.bankAccount.name = action.payload.name
      state.bankAccount.id = action.payload.id
    },

    // ─── EDIT WINDOWS ───────────────────────────────────────────────

    /** @param {boolean} action.payload */
    setIsTransactionEditWindowVisible: (state, action) => {
      state.isTransactionEditWindowVisible = action.payload
    },

    /** @param {boolean} action.payload */
    setIsRecurringEditWindowVisible: (state, action) => {
      state.isRecurringEditWindowVisible = action.payload
    },

    /** @param {boolean} action.payload */
    setIsCheckTransactionsEditWindowVisible: (state, action) => {
      state.isCheckTransactionsEditWindowVisible = action.payload
    },

    // ─── SELECTED TRANSACTIONS ──────────────────────────────────────

    /** Replace the whole selection. @param {Array} action.payload */
    setSelectedTransactionIds: (state, action) => {
      state.selectedTransactionIds = action.payload
    },
    /** Add one ID to the selection (ignored if already selected). */
    addSelectedTransactionId: (state, action) => {
      if (!state.selectedTransactionIds.includes(action.payload)) {
        state.selectedTransactionIds.push(action.payload)
      }
    },
    /** Remove one ID from the selection. */
    removeSelectedTransactionId: (state, action) => {
      state.selectedTransactionIds = state.selectedTransactionIds.filter(
        (id) => id !== action.payload,
      )
    },
    /** Empty the selection. */
    clearSelectedTransactionIds: (state) => {
      state.selectedTransactionIds = []
    },

    // ─── SELECTED RECURRING TRANSACTIONS ────────────────────────────

    /** Replace the whole selection. @param {Array} action.payload */
    setSelectedRecurringTransactionIds: (state, action) => {
      state.selectedRecurringTransactionIds = action.payload
    },
    /** Add one ID to the selection (ignored if already selected). */
    addSelectedRecurringTransactionId: (state, action) => {
      if (!state.selectedRecurringTransactionIds.includes(action.payload)) {
        state.selectedRecurringTransactionIds.push(action.payload)
      }
    },
    /** Remove one ID from the selection. */
    removeSelectedRecurringTransactionId: (state, action) => {
      state.selectedRecurringTransactionIds =
        state.selectedRecurringTransactionIds.filter(
          (id) => id !== action.payload,
        )
    },
    /** Empty the selection. */
    clearSelectedRecurringTransactionIds: (state) => {
      state.selectedRecurringTransactionIds = []
    },

    // ─── SELECTED CHECK TRANSACTIONS ────────────────────────────────

    /** Replace the whole selection. @param {Array} action.payload */
    setSelectedCheckTransactionIds: (state, action) => {
      state.selectedCheckTransactionIds = action.payload
    },
    /** Empty the selection. */
    clearSelectedCheckTransactionIds: (state) => {
      state.selectedCheckTransactionIds = []
    },

    // ─── TABLE SCROLL POSITION ──────────────────────────────────────

    /** @param {number|null} action.payload - Scroll offset in pixels */
    setTransactionsTableScrollPosition: (state, action) => {
      state.transactionsTableScrollPosition = action.payload
    },

    // ─── NEW TRANSACTION ────────────────────────────────────────────

    /** @param {string|number|null} action.payload - ID of the new transaction */
    setNewTransactionId: (state, action) => {
      state.newTransactionId = action.payload
    },

    // ─── CHECKING PARAMETERS ────────────────────────────────────────

    /** @param {string} action.payload - Date as ISO string (not a Date object) */
    setCheckingDate: (state, action) => {
      state.checking.date = action.payload
    },
    /** @param {number} action.payload */
    setCheckingInitialAmount: (state, action) => {
      state.checking.initialAmount = action.payload
    },
    /** @param {number} action.payload */
    setCheckingFinalAmount: (state, action) => {
      state.checking.finalAmount = action.payload
    },
    /** @param {number} action.payload */
    setCheckingCurrentAmount: (state, action) => {
      state.checking.currentAmount = action.payload
    },
    /** @param {boolean} action.payload */
    setNoneTransactionChecked: (state, action) => {
      state.checking.noneTransactionChecked = action.payload
    },
  },
})

// Export actions for dispatch
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
  setNoneTransactionChecked,
} = parametersSlice.actions

export default parametersSlice.reducer