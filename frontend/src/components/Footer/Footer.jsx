// 🎨 Styles
import "./Footer.scss"

// ⚛️ React
import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { faList } from "@fortawesome/free-solid-svg-icons"
import { faRepeat } from "@fortawesome/free-solid-svg-icons"
import { faListCheck } from "@fortawesome/free-solid-svg-icons"
import { faHouse } from "@fortawesome/free-solid-svg-icons"

const Footer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isAuthenticated = useSelector((state) => state.user.userId !== null)

  /** Log out the current user */
  const handleLogOut = () => {
    localStorage.removeItem("mybank_token")
    sessionStorage.removeItem("mybank_token")
    dispatch({ type: "user/clearUser" })
    dispatch({ type: "parameters/reset" })
    navigate("/login")
  }

  const NavItem = ({ to, isAuthenticated, children }) => (
    <NavLink
      to={to}
      aria-disabled={!isAuthenticated}
      tabIndex={isAuthenticated ? undefined : -1}
      onClick={(e) => {
        if (!isAuthenticated) e.preventDefault()
      }}
      className={({ isActive }) =>
        `navbar__icon ${isActive ? "active" : ""} ${!isAuthenticated ? "disabled" : ""}`
      }
    >
      {children}
    </NavLink>
  )

  return (
    <footer>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive
            ? "navbar__icon active"
            : `navbar__icon ${!isAuthenticated ? "disabled" : ""}`
        }
      >
        <FontAwesomeIcon className="navbar__icon-icon" icon={faHouse} />
      </NavLink>
      <NavItem to="/transactions" isAuthenticated={isAuthenticated}>
        <FontAwesomeIcon className="navbar__icon-icon" icon={faList} />
      </NavItem>
      <NavItem to="/recurringtransactions" isAuthenticated={isAuthenticated}>
        <FontAwesomeIcon className="navbar__icon-icon" icon={faRepeat} />
      </NavItem>
      <NavLink
        disabled
        to="/checktransactions"
        className={({ isActive }) =>
          isActive
            ? "navbar__icon active"
            : `navbar__icon ${!isAuthenticated ? "disabled" : ""}`
        }
      >
        <FontAwesomeIcon className="navbar__icon-icon" icon={faListCheck} />
      </NavLink>
      <div
        onClick={handleLogOut}
        className={`navbar__icon ${!isAuthenticated ? "disabled" : ""}`}
      >
        <FontAwesomeIcon
          className="navbar__icon-icon"
          icon={faArrowRightFromBracket}
        />
      </div>
    </footer>
  )
}

export default Footer
