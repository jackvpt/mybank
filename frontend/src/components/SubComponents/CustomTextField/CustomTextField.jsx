import { useState } from "react"
import "./CustomTextField.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faCopy } from "@fortawesome/free-solid-svg-icons"

const CustomTextField = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  error,
  helperText = "",
  disabled = false,
  clearField = true,
  copy = true,
}) => {
  const [focused, setFocused] = useState(false)

  const isFilled = value && value.length > 0

  return (
    <div
      className={`container__customtextfield 
        ${focused ? "focused" : ""}
        ${isFilled ? "filled" : ""}
        ${error ? "error" : ""}
        ${disabled ? "disabled" : ""}
      `}
    >
      <label htmlFor={id}>{label}</label>
      <div className="container__customtextfield--input">
        <div className="container__customtextfield--input--copy-btn">
          {copy && isFilled && !disabled && (
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(value)}
              disabled={disabled}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          )}
        </div>
        <input
          id={id}
          type={type}
          value={value}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={onChange}
        />
        {clearField && isFilled && !disabled && (
          <button
            type="button"
            className="container__customfield--clear-btn"
            onClick={() => onChange({ target: { value: "" } })}
            disabled={disabled || !isFilled}
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        )}

        {helperText && <span className="helper">{helperText}</span>}
      </div>{" "}
    </div>
  )
}

export default CustomTextField
