// 📁 CSS imports
import "./Loader.scss"

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
            <img
              className="loader__image"
              src="/logo-hh.png"
              alt="App logo"
              width={"48px"}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Loader
