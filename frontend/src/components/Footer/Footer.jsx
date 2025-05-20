import "./Footer.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { faTableList } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer>
      <Link to={"/dashboard"}>
        <FontAwesomeIcon icon={faHouse} className="navbar__icon" />
      </Link>
      <Link to={"/transactions"}>
        <FontAwesomeIcon icon={faTableList} className="navbar__icon" />
      </Link>
            <Link to={"/transactions"}>
        <FontAwesomeIcon icon={faRightFromBracket} className="navbar__icon" />
      </Link>
    </footer>
  )
}

export default Footer
