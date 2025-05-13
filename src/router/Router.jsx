import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "../components/Header/Header"
import Login from "../pages/Login/Login"
import Error from "../pages/Error/Error"


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
      <main className="container">
        <section className="section__main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </section>
      </main>
    </BrowserRouter>
  )
}
