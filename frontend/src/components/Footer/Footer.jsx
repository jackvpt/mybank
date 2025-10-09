import "./Footer.scss"

import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

// 👉 FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHouse,
  faList,
  faListCheck,
  faRepeat,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons"

const Footer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isAuthenticated = useSelector((state) => state.user.userId !== null)

  /** Log out the current user */
  const handleLogOut = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    dispatch({ type: "user/clearUser" })
    dispatch({ type: "parameters/reset" })
    navigate("/login")
  }

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
        <FontAwesomeIcon className="navbar__icon-image" icon={faHouse} />
      </NavLink>
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          isActive
            ? "navbar__icon active"
            : `navbar__icon ${!isAuthenticated ? "disabled" : ""}`
        }
      >
        <FontAwesomeIcon className="navbar__icon-image" icon={faList} />
      </NavLink>
      <NavLink
        to="/recurringtransactions"
        className={({ isActive }) =>
          isActive
            ? "navbar__icon active"
            : `navbar__icon ${!isAuthenticated ? "disabled" : ""}`
        }
      >
        <FontAwesomeIcon className="navbar__icon-image" icon={faRepeat} />
      </NavLink>
      <NavLink
        disabled
        to="/checktransactions"
        className={({ isActive }) =>
          isActive
            ? "navbar__icon active"
            : `navbar__icon ${!isAuthenticated ? "disabled" : ""}`
        }
      >
        <FontAwesomeIcon className="navbar__icon-image" icon={faListCheck} />
      </NavLink>
      <div
        onClick={handleLogOut}
        className={`navbar__icon ${!isAuthenticated ? "disabled" : ""}`}
      >
        <FontAwesomeIcon
          className="navbar__icon-image"
          icon={faRightFromBracket}
        />
      </div>
    </footer>
  )
}

export default Footer
