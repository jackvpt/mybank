import "./Footer.scss"

import HomeIcon from "@mui/icons-material/Home"
import ViewListIcon from "@mui/icons-material/ViewList"
import RepeatIcon from "@mui/icons-material/Repeat"
import CheckIcon from "@mui/icons-material/Checklist"
import LogOutIcon from "@mui/icons-material/LogOut"
import { NavLink } from "react-router-dom"

const Footer = () => {
  return (
    <footer>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? "navbar__icon active" : "navbar__icon"
        }
      >
        <HomeIcon />
      </NavLink>
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          isActive ? "navbar__icon active" : "navbar__icon"
        }
      >
        <ViewListIcon />
      </NavLink>
      <NavLink
        to="/recurringtransactions"
        className={({ isActive }) =>
          isActive ? "navbar__icon active" : "navbar__icon"
        }
      >
        <RepeatIcon />
      </NavLink>
      <NavLink
        to="/checktransactions"
        className={({ isActive }) =>
          isActive ? "navbar__icon active" : "navbar__icon"
        }
      >
        <CheckIcon />
      </NavLink>
      <NavLink
        to="/logout"
        className={({ isActive }) =>
          isActive ? "navbar__icon active" : "navbar__icon"
        }
      >
        <LogOutIcon />
      </NavLink>
    </footer>
  )
}

export default Footer
