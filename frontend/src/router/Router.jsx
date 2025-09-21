import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Header from "../components/Header/Header"
import Login from "../pages/Login/Login"
import Error from "../pages/Error/Error"
import Transactions from "../pages/Transactions/Transactions"
import Dashboard from "../pages/Dashboard/Dashboard"
import Footer from "../components/Footer/Footer"
import RecurringTransactions from "../pages/RecurringTransactions/RecurringTransactions"
import CheckTransactions from "../pages/CheckTransactions/CheckTransactions"
import { useSelector } from "react-redux"

/**
 * Application router component using React Router v6.
 *
 * @category Router
 * @component
 * @returns {JSX.Element} The main Router component for the application.
 */
export default function Router() {
  // Access Redux state to determine if a user is authenticated
  const isAuthenticated = useSelector((state) => state.user.id !== null)
  return (
    <>
      <Header />
      <main>
        <Routes>
          {/* Routes for unauthenticated users */}
          {!isAuthenticated ? (
            <>
              {/* Login page route */}
              <Route path="/login" element={<Login />} />
              {/* Redirect any unknown route to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              {/* Routes for authenticated users */}

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
              <Route path="*" element={<Dashboard />} />
            </>
          )}
        </Routes>
      </main>

      {/* Footer displayed on all pages */}
      <Footer />
    </>
  )
}
