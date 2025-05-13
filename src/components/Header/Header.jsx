import React from "react"
import "./Header.scss"
import { Link, NavLink } from "react-router-dom"
import logo from "../../assets/images/logo_mybank_white.png"

/**
 * Renders the main navigation header of the application.
 *
 * This component displays the application's logo and a navigation menu with links to the "View" and "Create" pages.
 *
 * @category Components
 * @component
 * @returns {React.Component} A React component displaying the header with navigation links.
 */
const Header = () => {
  return (
    <header>
      {/* Logo of the application */}
      <div className="logo">
        <Link to="/">
          <img
            className="logo__image"
            src={logo}
            alt="Logo SportSee"
            width="48"
            height="48"
          ></img>
        </Link>
      </div>
      <h1 className="logo__title">myBank</h1>
    </header>
  )
}

export default Header
