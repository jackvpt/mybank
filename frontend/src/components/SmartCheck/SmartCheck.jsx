// 🎨 Styles
import "./SmartCheck.scss"

// ⚛️ React
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

// 🪝 Hooks
import { useGetAllTransactions } from "../../hooks/useTransactions"

// 🧩 Components
import CustomFilePicker from "../SubComponents/CustomFilePicker/CustomFilePicker"
import CustomCloseButton from "../SubComponents/CustomCloseButton/CustomCloseButton"
import SmartCheckTable from "./SmartCheckTable"

import { dateToCustomDDMMYYYY } from "../../utils/formatNumber"
import AccountReportTransactionModel from "../../models/accountReportTransactionModel"

const SmartCheck = ({ open, onClose }) => {
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)

  // Get all transactions using the custom hook
  const { data: transactions = [] } = useGetAllTransactions()

  const notValidatedTransactions = transactions?.filter((transaction) => {
    return transaction.status !== "validated"
  })

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

  const notUsedTransactions = [...notValidatedTransactions]

  const reportAccountTransactions =
    accountReport?.compte?.operations?.map((transaction) => {
      const reportAccountTransaction = new AccountReportTransactionModel(
        transaction,
      )

      const matchedTransaction = notUsedTransactions.find(
        (notUsedTransaction) =>
          notUsedTransaction.amount === reportAccountTransaction.amount,
      )
      if (matchedTransaction) {
        reportAccountTransaction.matchedTransactionId = matchedTransaction.id
        notUsedTransactions.splice(
          notUsedTransactions.indexOf(matchedTransaction),
          1,
        )
      }

      return reportAccountTransaction
    }) ?? []

  const reportCardTransactions =
    accountReport?.carte?.operations?.map((transaction) => {
      const reportCardTransaction = new AccountReportTransactionModel(
        transaction,
      )

      const matchedTransaction = notUsedTransactions.find(
        (notUsedTransaction) =>
          notUsedTransaction.amount === reportCardTransaction.amount,
      )
      if (matchedTransaction) {
        reportCardTransaction.matchedTransactionId = matchedTransaction.id
        notUsedTransactions.splice(
          notUsedTransactions.indexOf(matchedTransaction),
          1,
        )
      }
      return reportCardTransaction
    }) ?? []

  const reportAllTransactions = [
    ...reportAccountTransactions,
    ...reportCardTransactions,
  ]

  const matchedTransactions = (reportTransactions) => {
    const used = new Set()

    return reportTransactions
      .map((reportTransaction) => {
        const match = notValidatedTransactions.find(
          (transaction) =>
            !used.has(transaction) &&
            transaction.amount === reportTransaction.amount,
        )
        if (match) used.add(match)
        return match
      })
      .filter(Boolean)
  }

  const notMatchedTransactions = () => {
    const matchedIds = new Set(
      matchedTransactions(reportAllTransactions).map(
        (transaction) => transaction.id,
      ),
    )

    const notMatched = notValidatedTransactions.filter(
      (t) => !matchedIds.has(t.id),
    )
    return notMatched
  }

  const pointedTransactions = transactions.filter((transaction) => {
    return transaction.status === "pointed"
  })

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
              <>
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
                    Solde initial :{" "}
                    <span className="container__smartCheck-content-firstPart-reportSummary-value">
                      {accountReport.compte.ancien_solde.montant.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    Solde final :{" "}
                    <span className="container__smartCheck-content-firstPart-reportSummary-value">
                      {accountReport.compte.nouveau_solde.montant.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    Nombre de transactions :{" "}
                    <span className="container__smartCheck-content-firstPart-reportSummary-value">
                      {reportAllTransactions.length}
                    </span>
                  </p>
                </div>
                <div className="container__smartCheck-content-firstPart-reportSummary">
                  <div className="container__smartCheck-content-firstPart-reportSummary-reportStatus">
                    <p>Différence du relevé :</p>
                    <div className="container__smartCheck-content-firstPart-reportSummary-value">
                      {(
                        accountReport.compte.nouveau_solde.montant -
                        accountReport.compte.ancien_solde.montant
                      ).toFixed(2)}
                    </div>
                  </div>
                  <div className="container__smartCheck-content-firstPart-reportSummary-reportStatus">
                    <p>Bilan du pointage :</p>
                    <div className="container__smartCheck-content-firstPart-reportSummary-value">
                      {pointedTransactions
                        .reduce(
                          (sum, transaction) => sum + transaction.amount,
                          0,
                        )
                        .toFixed(2)}
                    </div>
                  </div>
                  <div className="container__smartCheck-content-firstPart-reportSummary-reportStatus-validate">
                        Valider
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="container__smartCheck-content-tables">
            {/** Transactions from card */}
            {accountReport && (
              <SmartCheckTable
                title="Relevé - Carte de crédit"
                reportTransactions={reportCardTransactions}
              />
            )}

            {/** Transactions from account */}
            {accountReport && (
              <SmartCheckTable
                title="Relevé - Compte bancaire"
                reportTransactions={reportAccountTransactions}
              />
            )}

            {/** Transactions not matched */}
            {accountReport && (
              <SmartCheckTable
                title="Transactions non relevées"
                reportTransactions={notMatchedTransactions()}
                matchingMode={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SmartCheck
