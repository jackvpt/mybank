// 🎨 Styles
import "./SmartCheckTable.scss"

// 🪝 Hooks
import { useGetAllTransactions } from "../../hooks/useTransactions"

const SmartCheckTable = ({ reportTransactions, title }) => {
  // Get all transactions using the custom hook
  const { data: transactions = [] } = useGetAllTransactions()

  const notValidatedTransactions = transactions.filter((transaction) => {
    return transaction.status !== "validated"
  })

  const isMatchTransaction = (reportTransaction) =>
    notValidatedTransactions.some(
      (transaction) => transaction.amount === reportTransaction.amount,
    )

  console.log("notValidatedTransactions", notValidatedTransactions)

  return (
    <div className="container__smartCheckTable">
      <h3>{title}</h3>
      {reportTransactions.length > 0 ? (
        reportTransactions.map((reportTransaction, index) => (
          <div key={index} className="container__smartCheckTable-row">
            <div className="container__smartCheckTable-row-date">
              {reportTransaction.formattedDate}
            </div>
            <div className="container__smartCheckTable-row-label">
              {reportTransaction.label}
            </div>
            <div className="container__smartCheckTable-row-amount">
              {reportTransaction.amount.toFixed(2)}
            </div>
            <div className="container__smartCheckTable-row-match">
              {isMatchTransaction(reportTransaction) ? "✅" : "❌"}
            </div>
          </div>
        ))
      ) : (
        <div className="container__smartCheckTable-noTransactions">
          Aucune transaction
        </div>
      )}
    </div>
  )
}

export default SmartCheckTable
