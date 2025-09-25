// 📁 CSS imports
import "./Loader.scss"

// 👉 FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons"

/**
 * Loader component displaying a loading animation.
 * Uses a modal overlay with a spinner and localized loading text.
 *
 * @component
 * @returns {JSX.Element} Rendered Loader component
 */
const Loader = () => {
  return (
    <section className="loader">
      {/* Modal overlay */}
      <div className="loader__modal">
        <div className="loader__container">
          {/* Spinner animation */}
          <div className="loader__spinner"></div>

          {/* Loading text */}
          <div className="loader__text">
            {/* Logo */}
          <FontAwesomeIcon className="loader__icon" icon={faBuildingColumns} />

          </div>
        </div>
      </div>
    </section>
  )
}

export default Loader
