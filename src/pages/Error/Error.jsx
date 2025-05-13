import React from "react"
import { Link } from "react-router-dom"
import "./Error.scss"

/**
 * Displays a 404 error page for undefined routes.
 *
 * This component shows:
 * - A "404" heading
 * - A user-friendly error message
 * - A link to return to the home page
 *
 * @category Components
 * @component
 * @returns {JSX.Element} The 404 Error page component.
 */
const Error = () => {
  return (
    <section className="error">
      <h1>404</h1>
      <h2>Oups! La page que vous demandez n'existe pas</h2>
      <Link className="error__link" to="/" aria-label="Back to home page">
        Back to home page
      </Link>
    </section>
  )
}

export default Error
