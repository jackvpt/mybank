// 🌐 REACT Router
import { Routes, Route, Navigate } from "react-router-dom"

// 🪝 Hooks
import { useAuthToken } from "../hooks/useAuthToken"

// 🧩 Components
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"

// 📄 Pages
import Login from "../pages/Login/Login"
import Error from "../pages/Error/Error"
import Dashboard from "../pages/Dashboard/Dashboard"
import Transactions from "../pages/Transactions/Transactions"
import RecurringTransactions from "../pages/RecurringTransactions/RecurringTransactions"
import CheckTransactions from "../pages/CheckTransactions/CheckTransactions"

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route
                path="/recurringtransactions"
                element={<RecurringTransactions />}
              />
              <Route
                path="/checktransactions"
                element={<CheckTransactions />}
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
              <Route path="/login" element={<Login />} />

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
