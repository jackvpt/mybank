import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/main.scss" // Import the main SCSS styles
import App from "./App.jsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

/**
 * Initializes a new QueryClient instance for React Query.
 * This client is used to manage all queries and mutations within the app.
 */
const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
