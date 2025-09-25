// 📦 React imports
import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"

import storage from "redux-persist/lib/storage" // defaults to localStorage

// 🗃️ State & Data fetching
import parametersSlice from "../features/parametersSlice"
import userSlice from "../features/userSlice"

/**
 * Root reducer combining all slices of the Redux store.
 *
 * @category Redux
 * @constant
 */
const rootReducer = combineReducers({
  user: userSlice, // User state, will be persisted
  parameters: parametersSlice, // Volatile state, not persisted
})

/**
 * Configuration object for redux-persist.
 *
 * @category Redux
 * @constant
 * @type {object}
 * @property {string} key - Key for storage.
 * @property {object} storage - Storage engine (localStorage).
 * @property {string[]} whitelist - Slices of state to persist.
 */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "parameters"], // Only 'user' and 'parameters' slices are persisted
}

/**
 * Creates a persisted reducer with the configuration and root reducer.
 *
 * @category Redux
 * @constant
 */
const persistedReducer = persistReducer(persistConfig, rootReducer)

/**
 * Configures the Redux store with Redux Toolkit.
 *
 * @category Redux
 * @returns {import('@reduxjs/toolkit').EnhancedStore} The configured Redux store.
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable warnings from redux-persist
    }),
})

/**
 * Creates the persistor to enable persisting the store.
 *
 * @category Redux
 * @returns {import('redux-persist').Persistor} The persistor instance.
 */
export const persistor = persistStore(store)
