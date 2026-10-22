// 🎨 Styles
import "./CustomCloseButton.scss"

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

const CustomCloseButton = ({ onClick }) => {
  return (
    <div
      className="container__customCloseButton-button"
      onClick={onClick}
      aria-label="Close"
    >
      <FontAwesomeIcon icon={faXmark} />
    </div>
  )
}

export default CustomCloseButton
