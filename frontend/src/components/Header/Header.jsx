import React from "react"
import "./Header.scss"
import { Link, NavLink } from "react-router-dom"
import logo from "../../assets/images/logo_mybank_white.png"
import DevTools from "../devTools/DevTools"

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
            alt="Logo myBank"
            width="24"
            height="24"
          ></img>
        </Link>
      </div>
      <DevTools />
      <h1 className="logo__title">myBank</h1>
    </header>
  )
}

export default Header
