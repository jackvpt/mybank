// CSS
import "./CustomDatePicker.scss"

// React
import { useEffect, useRef, useState } from "react"

const pad = (n) => String(n).padStart(2, "0")
const fmt = (date) =>
  date instanceof Date && !isNaN(date)
    ? `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
    : ""

const parse = (s) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s)
  if (!m) return null
  const [, day, month, year] = m.map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null
}

// "12032024" -> "12/03/2024"
const mask = (raw) => {
  const x = raw.replace(/\D/g, "").slice(0, 8)
  return [x.slice(0, 2), x.slice(2, 4), x.slice(4)].filter(Boolean).join("/")
}

const sameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const DAYS = ["L", "M", "M", "J", "V", "S", "D"]

const Icon = ({ d }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
)

const CustomDatePicker = ({
  label,
  value,
  onChange,
  disabled = false,
  className = "",
  style,
}) => {
  const [text, setText] = useState(fmt(value))
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [view, setView] = useState(() => value ?? new Date())
  const rootRef = useRef(null)

  // Synchronize text when the value changes from the outside (reset, loading)
  useEffect(() => setText(fmt(value)), [value])

  // Close when clicking outside / Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e) => !rootRef.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const toggle = () => {
    if (!open) setView(value ?? new Date())
    setOpen((o) => !o)
  }

  const handleInput = (e) => {
    const next = mask(e.target.value)
    setText(next)
    if (next === "") onChange(null)
    else {
      const d = parse(next)
      if (d) onChange(d)
    }
  }

  const handleBlur = () => {
    setFocused(false)
    setText(fmt(value)) // Not valid? Reset to the last valid value
  }

  const year = view.getFullYear()
  const month = view.getMonth()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const count = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: count }, (_, i) => new Date(year, month, i + 1)),
  ]
  const today = new Date()
  const monthLabel = view.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })

  return (
    <div ref={rootRef} className={`datepicker ${className}`.trim()} style={style}>
      <div
        className={`datepicker__field ${focused || open ? "is-focused" : ""} ${disabled ? "is-disabled" : ""}`}
      >
        <label className="datepicker__label">{label}</label>
        <input
          className="datepicker__input"
          type="text"
          inputMode="numeric"
          placeholder="jj/mm/aaaa"
          value={text}
          disabled={disabled}
          onChange={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
        />
        <button
          type="button"
          className="datepicker__toggle"
          onClick={toggle}
          disabled={disabled}
          aria-label="Choisir la date"
        >
          <Icon d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
        </button>
        <fieldset className="datepicker__outline" aria-hidden="true">
          <legend>
            <span>{label}</span>
          </legend>
        </fieldset>
      </div>

      {open && (
        <div className="datepicker__popover" role="dialog" aria-label="Calendrier">
          <div className="datepicker__header">
            <button
              type="button"
              className="datepicker__nav"
              onClick={() => setView(new Date(year, month - 1, 1))}
              aria-label="Mois précédent"
            >
              <Icon d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </button>
            <span className="datepicker__month">{monthLabel}</span>
            <button
              type="button"
              className="datepicker__nav"
              onClick={() => setView(new Date(year, month + 1, 1))}
              aria-label="Mois suivant"
            >
              <Icon d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </button>
          </div>

          <div className="datepicker__grid">
            {DAYS.map((day, index) => (
              <span key={index} className="datepicker__dow">
                {day}
              </span>
            ))}
            {cells.map((day, index) =>
              day ? (
                <button
                  type="button"
                  key={index}
                  className={`datepicker__day ${sameDay(day, value) ? "is-selected" : ""} ${sameDay(day, today) ? "is-today" : ""}`}
                  onClick={() => {
                    onChange(day)
                    setOpen(false)
                  }}
                >
                  {day.getDate()}
                </button>
              ) : (
                <span key={index} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomDatePicker
