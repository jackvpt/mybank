// 🎨 Styles
import "./SmartCheck.scss"

// 🖼️ Images
import creditAgricoleLogo from "../../assets/images/logo_ca.webp"
import americanExpressLogo from "../../assets/images/logo_amex.webp"

// ⚛️ React
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

// 🪝 Hooks
import {
  useGetAllTransactions,
  useValidateTransactions,
} from "../../hooks/useTransactions"

// 🧩 Components
import CustomButton from "../SubComponents/CustomButton/CustomButton"
import CustomFilePicker from "../SubComponents/CustomFilePicker/CustomFilePicker"
import CustomCloseButton from "../SubComponents/CustomCloseButton/CustomCloseButton"
import SmartCheckTable from "./SmartCheckTable"

import { dateToCustomDDMMYYYY, toCents } from "../../utils/formatNumber"
import AccountReportTransactionModel from "../../models/accountReportTransactionModel"

const SmartCheck = ({ open, onClose }) => {
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)

  // Get all transactions using the custom hook
  const { data: transactions = [] } = useGetAllTransactions()

  // Mutations
  const { mutate: validateAllPointedMutation } = useValidateTransactions()

  const notValidatedTransactions = transactions?.filter((transaction) => {
    return transaction.status !== "validated"
  })

  const [firstAccountReport, setFirstAccountReport] = useState(null)
  const [secondAccountReport, setSecondAccountReport] = useState(null)

  /**
   * Receives the parsed statement from the picker.
   * Called with (null, null) when the selection is cleared.
   *
   * @param {File | null} file - Selected file, null on reset or rejection.
   * @param {import("../../utils/parseStatement").ParsedStatement | null} result - Parsed statement.
   */
  const handleFirstFileLoaded = (file, result) => {
    setFirstAccountReport(result)
  }

  /**
   * Receives the parsed statement from the picker.
   * Called with (null, null) when the selection is cleared.
   *
   * @param {File | null} file - Selected file, null on reset or rejection.
   * @param {import("../../utils/parseStatement").ParsedStatement | null} result - Parsed statement.
   */
  const handleSecondFileLoaded = (file, result) => {
    setSecondAccountReport(result)
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

  const matchOperations = (operations = []) =>
    operations.map((operation) => {
      const reportTransaction = new AccountReportTransactionModel(operation)

      const index = notUsedTransactions.findIndex(
        (transaction) => transaction.amount === reportTransaction.amount,
      )
      if (index !== -1) {
        reportTransaction.matchedTransactionId = notUsedTransactions[index].id
        notUsedTransactions.splice(index, 1)
      }

      return reportTransaction
    })

  const reportFirstAccountTransactions = matchOperations(
    firstAccountReport?.compte?.operations,
  )
  const reportFirstAccountCardTransactions = matchOperations(
    firstAccountReport?.carte?.operations,
  )
  const reportSecondAccountTransactions = [
    ...matchOperations(secondAccountReport?.operations),
  ]

  const reportAllTransactions = [
    ...reportFirstAccountTransactions,
    ...reportFirstAccountCardTransactions,
    ...reportSecondAccountTransactions,
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
    return notMatched.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const pointedTransactions = transactions.filter((transaction) => {
    return transaction.status === "pointed"
  })

  const reportBalance =
    firstAccountReport?.compte.nouveau_solde.montant -
    firstAccountReport?.compte.ancien_solde.montant

  const pointedTransactionBalance = pointedTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  )

  const differenceReportPointed = toCents(
    reportBalance - pointedTransactionBalance,
  )

  const isReportBalanced =
    firstAccountReport != null && differenceReportPointed.result === 0

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
              <img
                src={creditAgricoleLogo}
                alt="Crédit Agricole Logo"
                className="container__smartCheck-content-firstPart-filePicker-logo"
              />
              <CustomFilePicker
                title="Crédit Agricole"
                onFileLoaded={handleFirstFileLoaded}
              />
            </div>
            <div className="container__smartCheck-content-firstPart-filePicker">
              <img
                src={americanExpressLogo}
                alt="American Express Logo"
                className="container__smartCheck-content-firstPart-filePicker-logo"
              />
              <CustomFilePicker
                title="American Express"
                onFileLoaded={handleSecondFileLoaded}
              />
            </div>
            {firstAccountReport && (
              <>
                <div className="container__smartCheck-content-firstPart-reportSummary">
                  <p>
                    Relevé N°{" "}
                    <span className="container__smartCheck-content-firstPart-reportSummary-value">
                      {firstAccountReport.releve.numero}
                    </span>
                  </p>
                  <p>
                    Du{" "}
                    <span className="container__smartCheck-content-firstPart-reportSummary-value">
                      {dateToCustomDDMMYYYY(
                        firstAccountReport.releve.periode.du,
                      )}
                    </span>{" "}
                    au{" "}
                    <span className="container__smartCheck-content-firstPart-reportSummary-value">
                      {dateToCustomDDMMYYYY(
                        firstAccountReport.releve.periode.au,
                      )}
                    </span>
                  </p>

                  <p>
                    Solde initial :{" "}
                    <span className="container__smartCheck-content-firstPart-reportSummary-value">
                      {firstAccountReport.compte.ancien_solde.montant.toFixed(
                        2,
                      )}
                    </span>
                  </p>
                  <p>
                    Solde final :{" "}
                    <span className="container__smartCheck-content-firstPart-reportSummary-value">
                      {firstAccountReport.compte.nouveau_solde.montant.toFixed(
                        2,
                      )}
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
                      {toCents(reportBalance).text}
                    </div>
                  </div>
                  <div className="container__smartCheck-content-firstPart-reportSummary-reportStatus">
                    <p>Bilan du pointage :</p>
                    <div className="container__smartCheck-content-firstPart-reportSummary-value">
                      {toCents(pointedTransactionBalance).text}
                    </div>
                  </div>
                  <div className="container__smartCheck-content-firstPart-reportSummary-reportStatus">
                    <p>Ecart :</p>
                    <div className="container__smartCheck-content-firstPart-reportSummary-value">
                      {differenceReportPointed.text}
                    </div>
                  </div>
                  <div className="container__smartCheck-content-firstPart-reportSummary-validateButton">
                    <CustomButton
                      className="small"
                      action="validate"
                      disabled={!isReportBalanced}
                      onClick={validateAllPointedMutation}
                    >
                      Valider
                    </CustomButton>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="container__smartCheck-content-tables">
            {(firstAccountReport || secondAccountReport) && (
              <>
                {/** Transactions from first accountcard */}
                <SmartCheckTable
                  title="Relevé - Carte de crédit CA"
                  reportTransactions={reportFirstAccountCardTransactions}
                />

                {/** Transactions from first account */}
                <SmartCheckTable
                  title="Relevé - Crédit Agricole"
                  reportTransactions={reportFirstAccountTransactions}
                />

                {/** Transactions from secondaccount */}
                <SmartCheckTable
                  title="Relevé - American Express"
                  reportTransactions={reportSecondAccountTransactions}
                />
              </>
            )}

            {/** Transactions not matched */}
            <SmartCheckTable
              title="Transactions non relevées"
              reportTransactions={notMatchedTransactions()}
              matchingMode={false}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SmartCheck
