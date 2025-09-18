// 📁 CSS imports
import "./styles/_index.scss"

// 📦 React imports
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

// 🌐 React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

// 👉 Internal components
import App from "./App.jsx"

// 🗃️ State & Data fetching
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "./store/store.js"

// 🧩 MUI Core imports
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"

/**
 * Initializes a new QueryClient instance for React Query.
 *
 * This client manages all queries and mutations in the app.
 * - `refetchOnWindowFocus`: Automatically refetch queries when the window is focused.
 * - `refetchOnReconnect`: Refetch when the network reconnects.
 * - `refetchOnMount`: Refetch queries when a component mounts.
 * - `staleTime`: Time in milliseconds before cached data is considered stale (5 minute here).
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      staleTime: 300000, // Data is fresh for 5 minutes
    },
  },
})

// Global theme for MUI components
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
})

/**
 * Entry point of the React application.
 *
 * Wraps the App component with:
 * - `StrictMode` for highlighting potential problems in development
 * - `Provider` for Redux state management
 * - `PersistGate` to delay rendering until persisted Redux state is loaded
 * - `QueryClientProvider` to provide React Query client
 * - `BrowserRouter` for client-side routing
 * - `ReactQueryDevtools` for debugging React Query (dev tool, initially closed)
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <App />
            </ThemeProvider>{" "}
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
)
