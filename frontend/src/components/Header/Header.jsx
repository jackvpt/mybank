import React from "react"
import "./Header.scss"
import { Link } from "react-router-dom"

// 👉 FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons"

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
          <FontAwesomeIcon className="logo__icon" icon={faBuildingColumns} />
        </Link>
      </div>
      <h1 className="logo__title">myBank</h1>
    </header>
  )
}

export default Header
