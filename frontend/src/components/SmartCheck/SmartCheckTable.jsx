// 🎨 Styles
import "./SmartCheckTable.scss"

// ⚛️ React
import { useState } from "react"

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons"
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons"
import { faBan } from "@fortawesome/free-solid-svg-icons"

// 🪝 Hooks
import {
  useUpdateTransaction,
  useUpdateTransactionsStatus,
} from "../../hooks/useTransactions"

const SmartCheckTable = ({title, reportTransactions, matchedTransactions }) => {
  // 🔄 Mutations (toasts and "transactions" query invalidation are handled
  // inside useTransactions via useMutationWithNotification)
  const { mutate: updateTransaction } = useUpdateTransaction()
  const { mutate: updateTransactionsStatus } = useUpdateTransactionsStatus()

  const matchedTransaction = (reportTransaction) => {
    const matchedTransaction = matchedTransactions.find(
      (transaction) => transaction.amount === reportTransaction.amount,
    )
    if (matchedTransaction) {
      return matchedTransaction
    }
    return null
  }

  // Local state
  const [isDetailsVisible, setIsDetailsVisible] = useState([])
  const [isDisregard, setIsDisregard] = useState([])

  // Local functions
  const toggleDetailsVisibility = (index) => {
    setIsDetailsVisible((prevState) => {
      const newState = [...prevState]
      newState[index] = !newState[index]
      return newState
    })
  }

  const toggleDisregard = (index) => {
    setIsDisregard((prevState) => {
      const newState = [...prevState]
      newState[index] = !newState[index]
      return newState
    })
  }

  const handleToggleTransactionStatus = (transaction) => {
    const newStatus = transaction.status === "pointed" ? "" : "pointed"
    transaction.status = newStatus

    updateTransaction({
      id: transaction.id,
      updatedData: transaction,
      silent: true,
    })
  }

const handleUpdateTransactionsStatus = (transactions, newStatus) => {
  const ids = transactions
    .filter((transaction) => transaction.status !== newStatus)
    .map((transaction) => transaction.id)

  if (ids.length === 0) return

  updateTransactionsStatus({ ids, status: newStatus, silent: true })
}

  return (
    <div className="container__smartCheckTable">
      {/** Header */}
      <div className="container__smartCheckTable-header">
        <h3>{title}</h3>
        <div className="container__smartCheckTable-header-toolBox">
          <div
            className="container__smartCheckTable-row-matchedTransaction-status-indicator pointed"
            onClick={() => {
              handleUpdateTransactionsStatus(matchedTransactions, "pointed")
            }}
          ></div>
          <div
            className="container__smartCheckTable-row-matchedTransaction-status-indicator"
            onClick={() => {
              handleUpdateTransactionsStatus(matchedTransactions, "")
            }}
          ></div>
        </div>
      </div>
      {reportTransactions.length > 0 ? (
        reportTransactions.map((reportTransaction, index) => (
          // Row
          <div
            key={index}
            className={`container__smartCheckTable-row ${isDisregard[index] ? "row--disregarded" : ""}`}
          >
            {/** Report transaction */}
            <div className="container__smartCheckTable-row-reportTransaction">
              {/** Date */}
              <div className="container__smartCheckTable-row-date">
                {reportTransaction.formattedDate}
              </div>

              {/** Ban icon for disregarding the transaction */}
              <div className="container__smartCheckTable-row-disregard">
                <FontAwesomeIcon
                  className="container__smartCheckTable-row-disregardIcon"
                  icon={faBan}
                  onClick={() => toggleDisregard(index)}
                />
              </div>

              {/** Label and details */}
              <div className="container__smartCheckTable-row-label">
                {/** Description */}
                <div className="container__smartCheckTable-row-label-description">
                  {reportTransaction.label}
                  {reportTransaction.details && (
                    <FontAwesomeIcon
                      className="container__smartCheckTable-row-label-description-icon"
                      icon={faCircleInfo}
                      onClick={() => toggleDetailsVisibility(index)}
                    />
                  )}
                </div>
                {isDetailsVisible[index] && (
                  // Details
                  <div className="container__smartCheckTable-row-label-details">
                    {reportTransaction.details}
                  </div>
                )}
              </div>

              {/** Amount */}
              <div className="container__smartCheckTable-row-amount">
                {reportTransaction.amount.toFixed(2)}
              </div>
            </div>

            {/** Matched transaction */}
            <div className="container__smartCheckTable-row-matchedTransaction">
              {matchedTransaction(reportTransaction) ? (
                <>
                  {/** Match status */}
                  <FontAwesomeIcon
                    className="container__smartCheckTable-row-matchedTransaction-yesIcon"
                    icon={faSquareCheck}
                  />
                  <div className="container__smartCheckTable-row-matchedTransaction-date">
                    {matchedTransaction(reportTransaction).shortDate}
                  </div>
                  <div className="container__smartCheckTable-row-matchedTransaction-label">
                    {matchedTransaction(reportTransaction).label}
                  </div>
                  <div className="container__smartCheckTable-row-matchedTransaction-status">
                    <div
                      className={`container__smartCheckTable-row-matchedTransaction-status-indicator ${matchedTransaction(reportTransaction).status === "pointed" ? "pointed" : ""}`}
                      onClick={() => {
                        handleToggleTransactionStatus(
                          matchedTransaction(reportTransaction),
                        )
                      }}
                    ></div>
                  </div>
                </>
              ) : (
                <FontAwesomeIcon
                  className="container__smartCheckTable-row-matchedTransaction-noIcon"
                  icon={faSquareXmark}
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="container__smartCheckTable-noTransactions">
          Aucune transaction
        </div>
      )}

      {/** Footer with total amounts */}
      <div className="container__smartCheckTable-footer">
        <div className="container__smartCheckTable-footer-total">
          Total:{" "}
          {reportTransactions
            .reduce((sum, transaction) => sum + transaction.amount, 0)
            .toFixed(2)}{" "}
          (Débits:{" "}
          {reportTransactions
            .filter((t) => t.amount < 0)
            .reduce((sum, transaction) => sum + transaction.amount, 0)
            .toFixed(2)}{" "}
          | Crédits:{" "}
          {reportTransactions
            .filter((t) => t.amount > 0)
            .reduce((sum, transaction) => sum + transaction.amount, 0)
            .toFixed(2)}
          )
        </div>
      </div>
    </div>
  )
}

export default SmartCheckTable
