// 🎨 Styles
import "./CustomToggleButton.scss"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons"

const ICONS = {
  edit: faPen,
  magic: faWandMagicSparkles,
}

const CustomToggleButton = ({
  selected = false,
  onClick,
  disabled = false,
  text = "",
  iconStyle = "edit",
  ariaLabel,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={selected}
      aria-label={text ? undefined : ariaLabel}
      disabled={disabled}
      className={`container__customToggleButton ${selected ? "active" : ""}`}
      onClick={() => onClick?.(!selected)}
    >
      <FontAwesomeIcon icon={ICONS[iconStyle] ?? faPen} />
      {text && (
        <span className="container__customToggleButton--text">{text}</span>
      )}
    </button>
  )
}

export default CustomToggleButton