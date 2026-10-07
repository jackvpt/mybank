import { useRef, useState } from "react"
import "./CustomTextField.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faCopy } from "@fortawesome/free-solid-svg-icons"

/**
 * Text input with an optional floating label, clear button and copy button.
 *
 * Extra attributes can be forwarded to the underlying <input> through
 * `inputProps` (e.g. `list` for a native <datalist>, `autoComplete`,
 * `inputMode`, `maxLength`, `aria-*`, a `ref`, ...).
 *
 * @param {Object}   props
 * @param {string}   props.id - Id of the <input>, also used by the <label>.
 * @param {string}   [props.label] - Label text.
 * @param {string|number} [props.value] - Controlled value.
 * @param {Function} [props.onChange] - Change handler. Also called by the clear button
 *                                      with a minimal `{ target: { id, name, value } }` object.
 * @param {Function} [props.onBlur] - Blur handler.
 * @param {string}   [props.type="text"] - Native input type.
 * @param {boolean}  [props.error=false] - Error state (styling + aria-invalid).
 * @param {string}   [props.helperText=""] - Helper / error message shown next to the field.
 * @param {boolean}  [props.disabled=false] - Disable the field.
 * @param {boolean}  [props.clearField=true] - Show a clear button when the field is filled.
 * @param {boolean}  [props.copy=false] - Show a copy-to-clipboard button when the field is filled.
 * @param {boolean}  [props.floating=false] - Use a floating label instead of a static one.
 * @param {Object}   [props.inputProps={}] - Extra props spread on the native <input>.
 */
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
  inputProps = {},
}) => {
  const [focused, setFocused] = useState(false)

  // Internal ref so we can give focus back to the input after clearing.
  const internalRef = useRef(null)

  const isFilled = String(value ?? "").length > 0
  const helperId = helperText ? `${id}-helper` : undefined

  // Merge the internal ref with a ref possibly passed through inputProps.
  const setRefs = (node) => {
    internalRef.current = node
    const external = inputProps.ref
    if (typeof external === "function") external(node)
    else if (external) external.current = node
  }

  /**
   * Clear the field by calling onChange with a minimal event-like object.
   * Handlers that only read `e.target.value` / `e.target.id` keep working.
   */
  const handleClear = () => {
    onChange?.({ target: { id, name: id, value: "" } })
    internalRef.current?.focus()
  }

  /** Copy the current value to the clipboard (fails silently if not allowed). */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value))
    } catch {
      // Clipboard API unavailable (insecure context, permission denied...)
    }
  }

  const showCopy = copy && isFilled && !disabled
  const showClear = clearField && isFilled && !disabled

  const wrapperClasses = [
    "container__customtextfield--textfield",
    focused && "focused",
    isFilled && "filled",
    error && "error",
    disabled && "disabled",
    floating && "floating",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="container__customtextfield">
      {/* Static label, displayed above the field */}
      {label && !floating && <label htmlFor={id}>{label}</label>}

      <div className={wrapperClasses}>
        <div className="container__customtextfield--textfield--input">
          {/* Copy button, only rendered when it is actually visible */}
          {showCopy && (
            <div className="container__customtextfield--textfield--input--copy-btn">
              <button type="button" onClick={handleCopy} aria-label="Copy">
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          )}

          <div className="container__customtextfield--textfield--field">
            {/*
              Extra props are spread first so that the props managed by this
              component (id, type, value, handlers...) always win.
              Handlers are merged so inputProps handlers are not lost.
            */}
            <input
              {...inputProps}
              ref={setRefs}
              id={id}
              type={type}
              value={value ?? ""}
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={
                [inputProps["aria-describedby"], helperId]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              onFocus={(e) => {
                setFocused(true)
                inputProps.onFocus?.(e)
              }}
              onBlur={(e) => {
                setFocused(false)
                inputProps.onBlur?.(e)
                onBlur?.(e)
              }}
              onChange={(e) => {
                inputProps.onChange?.(e)
                onChange?.(e)
              }}
            />

            {/* Floating label, positioned over the input via CSS */}
            {floating && <label htmlFor={id}>{label}</label>}
          </div>

          {/* Clear button */}
          {showClear && (
            <button
              type="button"
              className="container__customtextfield--textfield--clear-btn"
              aria-label="Clear"
              // Prevent the input from blurring before the click is handled,
              // otherwise onBlur would run with the old value.
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          )}

          {helperText && (
            <span id={helperId} className="helper">
              {helperText}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomTextField
