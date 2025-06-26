import { configureStore } from "@reduxjs/toolkit"
import parametersReducer from "../features/parametersSlice"


export const store = configureStore({
  reducer: {
    parameters: parametersReducer,
  },
})
