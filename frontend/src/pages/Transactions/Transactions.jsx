import "./Transactions.scss"
import { useState } from "react"
import { useSelector } from "react-redux"
import {
  Box,
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material"

import TransactionsToolBar from "../../components/TransactionsToolBar/TransactionsToolBar"
import TransactionEdit from "../../components/TransactionEdit/TransactionEdit"
import { useFetchTransactions } from "../../hooks/useFetchTransactions"
import TransactionsTable from "../../components/sub-components/TransactionsTable/TransactionsTable"
import TransactionsCard from "../../components/sub-components/TransactionsCard/TransactionsCard.jsx"

const theme = createTheme({
  breakpoints: { values: { tablet: 768 } },
})
const Transactions = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("tablet"))

  const bankAccountName = useSelector(
    (state) => state.parameters.bankAccount.name
  )
  const bankAccountId = useSelector((state) => state.parameters.bankAccount.id)

  const isTransactionEditWindowVisible = useSelector(
    (state) => state.parameters.isTransactionEditWindowVisible
  )

  const [dateFilter, setDateFilter] = useState("all")

  const {
    isLoading: isLoadingTransactions,
    error: errorTransactions,
    data: transactionsData,
  } = useFetchTransactions()

  const transactions = transactionsData.filter(
    (transaction) => transaction.accountId === bankAccountId
  )

  if (isLoadingTransactions) return <p>Chargement des transactions...</p>
  if (errorTransactions) return <p>Erreur : {errorTransactions.message}</p>

  // Filter transactions by date
  const getFilteredTransactions = () => {
    const today = new Date()
    return transactions.filter((tx) => {
      const date = new Date(tx.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth() + 1

      switch (dateFilter) {
        case "currentYear":
          return year === currentYear
        case "lastYear":
          return year === currentYear - 1
        case "last12months": {
          const past = new Date(today)
          past.setMonth(today.getMonth() - 12)
          return date >= past
        }
        case "currentMonth":
          return year === currentYear && month === currentMonth
        case "previousMonth":
          return year === currentYear && month === currentMonth - 1
        case "last3months": {
          const start = new Date(today.getFullYear(), today.getMonth() - 2, 1)
          return date >= start
        }
        default:
          return true
      }
    })
  }

  const filteredTransactions = getFilteredTransactions()

  return (
    <section className="container-transactions">
      <div className="container-transactions__tools">
        <h1>{bankAccountName}</h1>
        <div className="toggle-tools">
          <TransactionsToolBar />
          <FormControl className="date-form-control" size="small">
            <InputLabel id="date-filter-label">Dates</InputLabel>
            <Select
              labelId="date-filter-label"
              value={dateFilter}
              label="Dates"
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value="all">Toutes</MenuItem>
              <MenuItem value="currentYear">Année en cours</MenuItem>
              <MenuItem value="lastYear">Année dernière</MenuItem>
              <MenuItem value="last12months">12 derniers mois</MenuItem>
              <MenuItem value="currentMonth">Mois en cours</MenuItem>
              <MenuItem value="previousMonth">Mois précédent</MenuItem>
              <MenuItem value="last3months">3 derniers mois</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {isTransactionEditWindowVisible && <TransactionEdit />}
      {isMobile ? 
      filteredTransactions.map((tx) => (
          <TransactionsCard key={tx.id} transaction={tx} />
      )) 
      
      
      
      
      
      : (
        <TransactionsTable filteredTransactions={filteredTransactions} />
      )}
    </section>
  )
}

export default Transactions
