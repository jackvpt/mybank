// 🎨 Styles
import { dateToCustomDDMMMMYYYY, euro } from "../../utils/formatNumber"
import "./DailyTransactionsCard.scss"

const DailyTransactionsCard = ({ date, transactions }) => {
  const isPositiveAmount = (amount) => {
    return amount > 0
  }

  const isFuture = (date) => {
    const today = new Date()
    const transactionDate = new Date(date)
    return transactionDate > today
  }

  return (
    <div className="container__dailyTransactionsCard">
      <h3>{dateToCustomDDMMMMYYYY(date)}</h3>
      <div
        className={`container__dailyTransactionsCard-card ${isFuture(date) ? "isFuture" : ""}`}
      >
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="container__dailyTransactionsCard-card-transactions"
          >
            <div className="container__dailyTransactionsCard-card-transactions-label">
              {transaction.label}
            </div>
            <div
              className={`container__dailyTransactionsCard-card-transactions-amount--${isPositiveAmount(transaction.amount) ? "positive" : "negative"}`}
            >
              {euro.format(transaction.amount)}{" "}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DailyTransactionsCard
