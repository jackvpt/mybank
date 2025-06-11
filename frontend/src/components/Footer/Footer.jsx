import "./Footer.scss"

import  HomeIcon from "@mui/icons-material/Home"
import  ViewListIcon from "@mui/icons-material/ViewList"
import  RepeatIcon from "@mui/icons-material/Repeat"
import  CheckIcon from "@mui/icons-material/Checklist"
import  LogOutIcon from "@mui/icons-material/LogOut"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer>
      <Link to={"/dashboard"}>
        <HomeIcon className="navbar__icon"/>
      </Link>
      <Link to={"/transactions"}>
        <ViewListIcon className="navbar__icon"/>
      </Link>
      <Link to={"/recurringtransactions"}>
        <RepeatIcon className="navbar__icon"/>
      </Link>
      <Link to={"/checktransactions"}>
        <CheckIcon className="navbar__icon"/>
      </Link>
      <Link to={"/transactions"}>
        <LogOutIcon className="navbar__icon"/>
      </Link>
    </footer>
  )
}

export default Footer
