import { useLayoutEffect, useRef, useState } from "react"
import "./CustomTextField.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faCopy } from "@fortawesome/free-solid-svg-icons"

/**
 * Text input with an optional floating label, clear button, copy button
 * and optional inline autocompletion.
 *
 * Autocompletion is enabled simply by passing the `suggestions` prop.
 * Without it, the component behaves like a plain text field.
 * While typing, the first matching suggestion is appended to the text and
 * selected: keep typing to override it, Tab or ArrowRight to accept it,
 * Escape to drop it.
 *
 * @param {Object}   props
 * @param {string}   props.id - Id of the <input>, also used by the <label>.
 * @param {string}   [props.label] - Label text.
 * @param {string|number} [props.value] - Controlled value.
 * @param {Function} [props.onChange] - Change handler. Also called by the clear button and by
 *                                      the autocompletion with a minimal `{ target: { id, name, value } }`.
 * @param {Function} [props.onBlur] - Blur handler.
 * @param {string}   [props.type="text"] - Native input type.
 * @param {boolean}  [props.error=false] - Error state (styling + aria-invalid).
 * @param {string}   [props.helperText=""] - Helper / error message shown next to the field.
 * @param {boolean}  [props.disabled=false] - Disable the field.
 * @param {boolean}  [props.clearField=true] - Show a clear button when the field is filled.
 * @param {boolean}  [props.copy=false] - Show a copy-to-clipboard button when the field is filled.
 * @param {boolean}  [props.floating=false] - Use a floating label instead of a static one.
 * @param {Object}   [props.inputProps={}] - Extra props spread on the native <input>.
 * @param {string[]|null} [props.suggestions=null] - Enables inline autocompletion when provided.
 *   Order matters: the first suggestion starting with the typed text wins
 *   (e.g. sort by frequency). Only active for type "text" or "search".
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
  suggestions = null,
}) => {
  const [focused, setFocused] = useState(false)

  // Internal ref: used for the caret/selection and to refocus after clearing.
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

  // --- Inline autocompletion -------------------------------------------------

  // selectionStart is null on email/number inputs, so only text-like types are supported.
  const canAutocomplete =
    Array.isArray(suggestions) &&
    suggestions.length > 0 &&
    (type === "text" || type === "search")

  // True right after Backspace/Delete, so deleting is never "undone" by a completion.
  const skipCompletion = useRef(false)

  // [start, end] of the suggested part, applied once React has rendered the new value.
  const pendingSelection = useRef(null)

  // Runs after every render (no deps on purpose) to select the suggested part.
  useLayoutEffect(() => {
    if (pendingSelection.current && internalRef.current) {
      internalRef.current.setSelectionRange(...pendingSelection.current)
    }
    pendingSelection.current = null
  })

  const handleInputChange = (e) => {
    inputProps.onChange?.(e)

    const typed = e.target.value
    const shouldComplete =
      canAutocomplete &&
      !skipCompletion.current &&
      !e.nativeEvent?.isComposing && // not during IME composition
      typed.length > 0 &&
      internalRef.current?.selectionStart === typed.length // caret at the end only
    skipCompletion.current = false

    if (shouldComplete) {
      const lower = typed.toLowerCase()
      const match = suggestions.find(
        (s) => s.length > typed.length && s.toLowerCase().startsWith(lower)
      )
      if (match) {
        // Keep the user's casing and append the rest of the suggestion
        const completed = typed + match.slice(typed.length)
        pendingSelection.current = [typed.length, completed.length]
        onChange?.({ target: { id, name: e.target.name || id, value: completed } })
        return
      }
    }
    onChange?.(e)
  }

  const handleKeyDown = (e) => {
    inputProps.onKeyDown?.(e)
    if (!canAutocomplete) return

    skipCompletion.current = e.key === "Backspace" || e.key === "Delete"

    // Escape drops the suggested (selected) part and keeps what was typed
    if (e.key === "Escape") {
      const input = e.currentTarget
      if (input.selectionStart !== input.selectionEnd) {
        e.stopPropagation()
        onChange?.({
          target: { id, name: id, value: input.value.slice(0, input.selectionStart) },
        })
      }
    }
  }

  // --- Buttons ---------------------------------------------------------------

  /** Clear the field with an event-like object, then give focus back to the input. */
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
              <button type="button" onClick={handleCopy} aria-label="Copier">
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
                [inputProps["aria-describedby"], helperId].filter(Boolean).join(" ") ||
                undefined
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
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />

            {/* Floating label, positioned over the input via CSS */}
            {floating && <label htmlFor={id}>{label}</label>}
          </div>

          {/* Clear button */}
          {showClear && (
            <button
              type="button"
              className="container__customtextfield--textfield--clear-btn"
              aria-label="Effacer"
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
