import "./Footer.scss"

import HomeIcon from "@mui/icons-material/Home"
import ViewListIcon from "@mui/icons-material/ViewList"
import RepeatIcon from "@mui/icons-material/Repeat"
import CheckIcon from "@mui/icons-material/Checklist"
import LogOutIcon from "@mui/icons-material/Logout"
import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

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
          isActive ? "navbar__icon active" : `navbar__icon ${!isAuthenticated ? "disabled" : ""}`
        }
      >
        <HomeIcon />
      </NavLink>
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          isActive ? "navbar__icon active" : `navbar__icon ${!isAuthenticated ? "disabled" : ""}`
        }
      >
        <ViewListIcon />
      </NavLink>
      <NavLink
        to="/recurringtransactions"
        className={({ isActive }) =>
          isActive ? "navbar__icon active" : `navbar__icon ${!isAuthenticated ? "disabled" : ""}`
        }
      >
        <RepeatIcon />
      </NavLink>
      <NavLink
        disabled
        to="/checktransactions"
        className={({ isActive }) =>
          isActive ? "navbar__icon active" : `navbar__icon ${!isAuthenticated ? "disabled" : ""}`
        }
      >
        <CheckIcon />
      </NavLink>
      <div onClick={handleLogOut} className={`navbar__icon ${!isAuthenticated ? "disabled" : ""}`}>
        <LogOutIcon />
      </div>
    </footer>
  )
}

export default Footer
