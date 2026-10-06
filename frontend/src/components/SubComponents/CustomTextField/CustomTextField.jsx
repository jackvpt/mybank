import { useState } from "react"
import "./CustomTextField.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faCopy } from "@fortawesome/free-solid-svg-icons"

const CustomTextField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  error = false,
  helperText = "",
  disabled = false,
  clearField = true,
  copy = false,
  floating = false,
}) => {
  const [focused, setFocused] = useState(false)

  const isFilled = String(value ?? "").length > 0

  return (
    <div className="container__customtextfield">
      {label && !floating && <label htmlFor={id}>{label}</label>}
      <div
        className={`container__customtextfield--textfield 
        ${focused ? "focused" : ""}
        ${isFilled ? "filled" : ""}
        ${error ? "error" : ""}
        ${disabled ? "disabled" : ""}
        ${floating ? "floating" : ""}
      `}
      >
        <div className="container__customtextfield--textfield--input">
          {copy && (
            <div className="container__customtextfield--textfield--input--copy-btn">
              {copy && isFilled && !disabled && (
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(String(value))}
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              )}
            </div>
          )}
          <div className="container__customtextfield--textfield--field">
            <input
              id={id}
              type={type}
              value={value ?? ""}
              disabled={disabled}
              onFocus={() => setFocused(true)}
              onBlur={(e) => {
                setFocused(false)
                onBlur?.(e)
              }}
              onChange={onChange}
            />
            {floating && <label htmlFor={id}>{label}</label>}
          </div>
          {clearField && isFilled && !disabled && (
            <button
              type="button"
              className="container__customtextfield--textfield--clear-btn"
              onClick={() => onChange({ target: { id, name: id, value: "" } })}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          )}

          {helperText && <span className="helper">{helperText}</span>}
        </div>
      </div>
    </div>
  )
}

export default CustomTextField
