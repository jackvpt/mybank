import { configureStore } from "@reduxjs/toolkit"
import settingsReducer from "../features/settingsSlice"


export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
})
