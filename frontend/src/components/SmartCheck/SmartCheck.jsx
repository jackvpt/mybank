// 🎨 Styles
import "./SmartCheck.scss"

// ⚛️ React
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

// 🧩 Components
import CustomFilePicker from "../SubComponents/CustomFilePicker/CustomFilePicker"
import CustomCloseButton from "../SubComponents/CustomCloseButton/CustomCloseButton"

import { dateToCustomDDMMYYYY } from "../../utils/formatNumber"
import AccountReportTransactionModel from "../../models/accountReportTransactionModel"

const SmartCheck = ({ open, onClose }) => {
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)

  /** @type {[import("../../utils/parseStatement").ParsedStatement | null, Function]} */
  const [accountReport, setAccountReport] = useState(null)

  /**
   * Receives the parsed statement from the picker.
   * Called with (null, null) when the selection is cleared.
   *
   * @param {File | null} file - Selected file, null on reset or rejection.
   * @param {import("../../utils/parseStatement").ParsedStatement | null} result - Parsed statement.
   */
  const handleFileLoaded = (file, result) => {
    setAccountReport(result)
  }

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

  const reportTransactions =
    accountReport?.transactions?.map(
      (transaction) => new AccountReportTransactionModel(transaction),
    ) ?? []
  console.log("reportTransactions", reportTransactions)
  return createPortal(
    <div className="container__smartCheck-backdrop">
      <div
        className="container__smartCheck-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="smartCheck-title"
      >
        <div className="container__smartCheck-header">
          <h2 id="smartCheck-title">Smart Check</h2>
          <CustomCloseButton onClick={onClose} ref={closeRef} />
        </div>
        <div className="container__smartCheck-content">
          <div className="container__smartCheck-content-filePicker">
            <CustomFilePicker onFileLoaded={handleFileLoaded} />
          </div>
          {accountReport && (
            <div className="container__smartCheck-content-reportSummary">
              <p>Relevé N° {accountReport.releve}</p>
              <p>Du {dateToCustomDDMMYYYY(accountReport.periode.du)}</p>
              <p>Au {dateToCustomDDMMYYYY(accountReport.periode.au)}</p>
              <p>Solde initial: {accountReport.solde_initial}</p>
              <p>Solde final: {accountReport.solde_final}</p>
              <p>Nombre de transactions: {accountReport.transactions.length}</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SmartCheck
