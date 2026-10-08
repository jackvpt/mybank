// CSS
import "./CustomDialog.scss"

// React
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

export default function CustomDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
  cancelLabel = "Annuler",
  confirmLabel = "Confirmer",
  danger = false,
}) {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    cancelRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="container__customDialog-backdrop" onClick={onClose}>
      <div
        className="container__customDialog-paper"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dlg-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dlg-title" className="container__customDialog-title">
          {title}
        </h2>
        <div className="container__customDialog-content">{children}</div>
        <div className="container__customDialog-actions">
          <button
            ref={cancelRef}
            className="container__customDialog-btn container__customDialog-btn-text"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            className={`container__customDialog-btn container__customDialog-btn-contained ${danger ? "danger" : ""}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
