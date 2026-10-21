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

  const reportAccountTransactions =
    accountReport?.compte?.operations?.map(
      (transaction) => new AccountReportTransactionModel(transaction),
    ) ?? []

  const reportCarTransctions =
    accountReport?.carte?.operations?.map(
      (transaction) => new AccountReportTransactionModel(transaction),
    ) ?? []

  const reportAllTransactions = [
    ...reportAccountTransactions,
    ...reportCarTransctions,
  ]

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
          <div className="container__smartCheck-content-firstPart">
            <div className="container__smartCheck-content-firstPart-filePicker">
              <CustomFilePicker onFileLoaded={handleFileLoaded} />
            </div>
            {accountReport && (
              <div className="container__smartCheck-content-firstPart-reportSummary">
                <p>
                  Relevé N°{" "}
                  <span className="container__smartCheck-content-firstPart-reportSummary-value">
                    {accountReport.releve.numero}
                  </span>
                </p>
                <p>
                  Du{" "}
                  <span className="container__smartCheck-content-firstPart-reportSummary-value">
                    {dateToCustomDDMMYYYY(accountReport.releve.periode.du)}
                  </span>{" "}
                  au{" "}
                  <span className="container__smartCheck-content-firstPart-reportSummary-value">
                    {dateToCustomDDMMYYYY(accountReport.releve.periode.au)}
                  </span>
                </p>

                <p>
                  Solde initial : <span className="container__smartCheck-content-firstPart-reportSummary-value">
                    {accountReport.compte.ancien_solde.montant}
                  </span>
                </p>
                <p>
                  Solde final : <span className="container__smartCheck-content-firstPart-reportSummary-value">
                    {accountReport.compte.nouveau_solde.montant}
                  </span>
                </p>
                <p>
                  Nombre de transactions trouvées :{" "}
                 <span className="container__smartCheck-content-firstPart-reportSummary-value">
                    {reportAllTransactions.length}
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="container__smartCheck-content-table">
            { reportAllTransactions.length > 0 ? (
              reportAllTransactions.map((transaction, index) => (
                <div
                  key={index}
                  >
                  <p>{transaction.formattedDate}</p>
                  <p>{transaction.label}</p>
                  <p>{transaction.amount}</p>
                </div>
              ))
            ) : (
              <p>Aucune transaction trouvée.</p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SmartCheck
