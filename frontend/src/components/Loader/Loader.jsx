// 📁 CSS imports
import "./Loader.scss"

// 🖼️ Image imports
import Logo from "../../assets/images/logo_mybank_black.svg?react"
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
            <Logo className="loader__image" />{" "}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Loader
