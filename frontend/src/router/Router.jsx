import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "../components/Header/Header"
import Login from "../pages/Login/Login"
import Error from "../pages/Error/Error"
import Transactions from "../pages/Transactions/Transactions"
import Dashboard from "../pages/Dashboard/Dashboard"
import Footer from "../components/Footer/Footer"
import RecurringTransactionEdit from "../components/RecurringTransactionEdit/RecurringTransactionEdit"
import RecurringTransactions from "../pages/RecurringTransactions/RecurringTransactions"

/**
 * Application router component using React Router v6.
 *
 * @category Router
 * @component
 * @returns {JSX.Element} The main Router component for the application.
 */
export default function Router() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/recurringtransactions" element={<RecurringTransactions />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
