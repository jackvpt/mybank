import { configureStore, combineReducers } from "@reduxjs/toolkit"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage" // localStorage

// 🧩 Slices
import userReducer, { clearUser } from "./features/userSlice"
import parametersReducer from "./features/parametersSlice"
// import searchAccountReducer from "../features/searchSlice"

// 🔗 Combine all reducers
const appReducer = combineReducers({
  user: userReducer,
  parameters: parametersReducer,
  // searchAccount: searchAccountReducer,
})

// 🚪 Root reducer: wipes the whole state on logout
// Passing `undefined` makes every slice fall back to its initial state,
// so no data from the previous user can leak to the next one.
// redux-persist then overwrites the persisted "user" slice with the empty one.
const rootReducer = (state, action) => {
  if (action.type === clearUser.type) {
    state = undefined
  }
  return appReducer(state, action)
}

// 💾 Persist config
const persistConfig = {
  key: "root",
  version: 1, // bump when the shape of the persisted state changes
  storage,
  whitelist: ["user", "parameters"],
}

// 🔁 Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// 🏪 Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Actions dispatched by redux-persist carry non-serializable values
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          // ⚠️ Temporary: only needed while Date objects are stored in state.
          // Remove it (and ignoredPaths) once dates are stored as ISO strings.
          "selectedAccount/setSelectedAccount",
        ],
        // ⚠️ Temporary, same reason as above
        ignoredPaths: [
          "selectedAccount.createdAt",
          "selectedAccount.updatedAt",
        ],
      },
    }),
})

// 💾 Persistor (consumed by <PersistGate> in main.jsx)
export const persistor = persistStore(store)