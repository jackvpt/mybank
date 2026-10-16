// CSS
import "./SmartCheck.scss"

// React
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

// 🧩 Components
import CustomFilePicker from "../SubComponents/CustomFilePicker/CustomFilePicker"

const SmartCheck = ({ open, onClose }) => {
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)

  // Garde toujours la dernière version de onClose sans relancer l'effet
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current?.()
    }
    document.addEventListener("keydown", onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    closeRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="container__smartCheck--backdrop"
    >
      <div
        className="container__smartCheck--dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="smartCheck-title"
      >
        <header className="container__smartCheck--header">
          <h2 id="smartCheck-title">Smart Check</h2>
          <button
            ref={closeRef}
            type="button"
            className="container__smartCheck--close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </header>

        <div className="container__smartCheck--content">
          <CustomFilePicker />
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SmartCheck
