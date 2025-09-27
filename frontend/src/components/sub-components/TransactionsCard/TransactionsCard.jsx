import "./TransactionsCard.scss"
import { Card, CardContent, Typography } from "@mui/material"

const TransactionsCard = ({ transaction }) => {
  console.log("transaction :>> ", transaction)

  return (
    <div className="transaction-card">
      <div className="transaction-card__label">{transaction.label}</div>
      <div
        className={`transaction-card__amount ${
          transaction.credit > 0 ? "positive" : ""
        }`}
      >
        {transaction.amountSummary}
      </div>
    </div>
  )
}

export default TransactionsCard
