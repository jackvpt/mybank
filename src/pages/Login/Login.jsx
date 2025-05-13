import React from "react"
import { Link } from "react-router-dom"
import "./Login.scss"

/**

 * @category Components
 * @component
 * @returns {JSX.Element} The 404 Error page component.
 */
const Login = () => {
  return (
    <section className="error">
      <h1>404</h1>
      <h2>Oops! The page you're looking for doesn't exist.</h2>
      <Link className="error__link" to="/" aria-label="Back to home page">
        Back to home page
      </Link>
    </section>
  )
}

export default Login
