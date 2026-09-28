// 📁 CSS imports
import "./Loader.scss"

// 🖼️ Image imports
import Logo from "../../assets/images/logo_mybank_black.svg?react"
/**
 * Loader component displaying a loading animation.
 * Uses a modal overlay with a spinner and localized loading text.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} [props.variant="fullscreen"] - The variant of the loader, either "fullscreen" or "inline"
 * @param {string} [props.size="lg"] - The size of the loader, either "sm", "md", or "lg"
 * @param {string} [props.label="Loading"] - The label for accessibility purposes
 * @returns {JSX.Element} Rendered Loader component
 */
const Loader = ({ variant = "fullscreen", size = "lg", label = "" }) => {
  const isInline = variant === "inline"

  return (
    <section
      className={`container__loader--modal container__loader--${size}${
        isInline ? " container__loader--inline" : ""
      }`}
      role="status"
      aria-label={label || "Loading"}
    >
      <div className="container__loader--content">
        <div className="container__loader--ring">
          <div className="container__loader--spinner" />
          {!isInline && (
            <div className="container__loader--text">
              <Logo className="container__loader--image" />
            </div>
          )}
        </div>

        {label && <p className="container__loader--label">{label}</p>}
      </div>
    </section>
  )
}

export default Loader
