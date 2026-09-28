// 🌐 REACT Router
import { Routes, Route, Navigate } from "react-router-dom"

// 🪝 Hooks
import { useAuthToken } from "../hooks/useAuthToken"

// 🧩 Components
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"

// 📄 Pages
import LoginPage from "../pages/LoginPage/LoginPage"
import Error from "../pages/Error/Error"
import DashboardPage from "../pages/DashboardPage/DashboardPage"
import TransactionsPage from "../pages/TransactionsPage/TransactionsPage"
import RecurringTransactionsPage from "../pages/RecurringTransactionsPage/RecurringTransactionsPage"
import CheckTransactionsPage from "../pages/CheckTransactionsPage/CheckTransactionsPage"

/**
 * Router — application router component using React Router v6.
 *
 * Auth state comes from `useAuthToken` (single source of truth) rather
 * than reading Redux state directly here — keeps this component
 * reactive to auth changes and avoids duplicating the validity logic
 * that already lives in the hook (and in `AppInitializer`).
 *
 * @category Router
 * @component
 * @returns {JSX.Element} The main Router component for the application.
 */
const Router = () => {
  const { isSuccess: isAuthenticated } = useAuthToken()
  // const isAuthenticated = true // Temporary override for development/testing

  return (
    <>
      {/* Header displayed on all pages */}
      <Header />

      {/* SEO-compliant main landmark */}
      <main role="main">
        <Routes>
          {isAuthenticated ? (
            <>
              {/* Routes for authenticated users only */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route
                path="/recurringtransactions"
                element={<RecurringTransactionsPage />}
              />
              <Route
                path="/checktransactions"
                element={<CheckTransactionsPage />}
              />

              {/* Logged-in users shouldn't see login —
                  redirect them back to the dashboard instead */}
              <Route
                path="/login"
                element={<Navigate to="/dashboard" replace />}
              />

              {/* Catch-all route for unknown paths */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <>
              {/* Routes available to unauthenticated visitors */}
              <Route path="/login" element={<LoginPage />} />

              {/* Redirect any other unknown route to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </main>

      {/* Footer displayed on all pages */}
      <Footer />
    </>
  )
}

export default Router
