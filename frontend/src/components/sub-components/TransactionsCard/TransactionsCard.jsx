import { useDispatch } from "react-redux"
import "./TransactionsCard.scss"
import { setSelectedTransactionIds } from "../../../features/parametersSlice"

const TransactionsCard = ({ date, transactions }) => {
  const dispatch = useDispatch()
  
  const formattedDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    })

  const handleTransactionClick = (transactionId) => () => {
    dispatch(setSelectedTransactionIds([transactionId]))
  }

  return (
    <div className="transaction-card">
      <div className="transaction-card__date">{formattedDate(date)}</div>
      <div className="transaction-card__transactions">
        {transactions.map((transaction) => (
          <div
            className="transaction-card__content"
            key={transaction.id}
            onClick={handleTransactionClick(transaction.id)}
          >
            <div className="transaction-card__label">{transaction.label}</div>
            <div
              className={`transaction-card__amount ${
                transaction.credit > 0 ? "positive" : ""
              }`}
            >
              {transaction.amountSummary}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionsCard
