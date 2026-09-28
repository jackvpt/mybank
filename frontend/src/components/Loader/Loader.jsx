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
    <section className="container__loader">
      {/* Modal overlay */}
      <div className="container__loader--modal">
        <div className="container__loader--content">
          {/* Spinner animation */}
          <div className="container__loader--spinner"></div>

          {/* Loading text */}
          <div className="container__loader--text">
            {/* Logo */}
            <Logo className="container__loader--image" />{" "}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Loader
