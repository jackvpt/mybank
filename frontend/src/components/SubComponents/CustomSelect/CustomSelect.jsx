// CSS
import "./CustomSelect.scss"

// React
import { useEffect, useRef, useState } from "react"

const Chevron = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M7 10l5 5 5-5z" />
  </svg>
)

/**
 * options: [{ value, label }]
 * onChange gets directly the value of the selected option
 */
const CustomSelect = ({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  className = "",
  style,
}) => {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(-1)
  const listRef = useRef(null)

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = options[selectedIndex]
  const shrunk = open || focused || selected !== undefined

  const openList = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0)
    setOpen(true)
  }

  const choose = (opt) => {
    onChange(opt.value)
    setOpen(false)
  }

  // Keep the active option in view when opening the list or changing the active option
  useEffect(() => {
    if (open)
      listRef.current?.children[active]?.scrollIntoView({ block: "nearest" })
  }, [open, active])

  const handleKeyDown = (e) => {
    if (disabled) return
    const last = options.length - 1
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        open ? setActive((i) => Math.min(i + 1, last)) : openList()
        break
      case "ArrowUp":
        e.preventDefault()
        open ? setActive((i) => Math.max(i - 1, 0)) : openList()
        break
      case "Home":
        if (open) {
          e.preventDefault()
          setActive(0)
        }
        break
      case "End":
        if (open) {
          e.preventDefault()
          setActive(last)
        }
        break
      case "Enter":
      case " ":
        e.preventDefault()
        if (!open) openList()
        else if (options[active]) choose(options[active])
        break
      case "Escape":
        setOpen(false)
        break
      default:
    }
  }

  return (
    <div className={`customSelect ${className}`.trim()} style={style}>
      <div
        className={`customSelect__field ${focused || open ? "is-focused" : ""} ${disabled ? "is-disabled" : ""}`}
      >
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          className="customSelect__trigger"
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            setOpen(false)
          }}
        >
          {selected?.label ?? "\u200b"}
        </button>
        <span className={`customSelect__arrow ${open ? "is-open" : ""}`}>
          <Chevron />
        </span>
        <label className={`customSelect__label ${shrunk ? "is-shrunk" : ""}`}>
          {label}
        </label>
        <fieldset className="customSelect__outline" aria-hidden="true">
          <legend className={shrunk ? "is-shrunk" : ""}>
            <span>{label}</span>
          </legend>
        </fieldset>
      </div>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="customSelect__list"
          // Prevents the list from stealing focus when clicking on an option (otherwise the blur event on the button would close the list before the click event on the option is processed)
          onMouseDown={(e) => e.preventDefault()}
        >
          {options.map((option, index) => (
            <li
              key={String(option.value)}
              role="option"
              aria-selected={index === selectedIndex}
              className={`customSelect__option ${index === selectedIndex ? "is-selected" : ""} ${index === active ? "is-active" : ""}`}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomSelect
