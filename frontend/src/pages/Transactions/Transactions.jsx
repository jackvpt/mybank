import "./Transactions.scss"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useMediaQuery,
} from "@mui/material"
import {
  addSelectedTransactionId,
  removeSelectedTransactionId,
  setNewTransactionId,
  setSelectedTransactionIds,
  setTransactionsTableScrollPosition,
} from "../../features/parametersSlice"
import TransactionsToolBar from "../../components/TransactionsToolBar/TransactionsToolBar"
import TransactionEdit from "../../components/TransactionEdit/TransactionEdit"
import { useFetchTransactions } from "../../hooks/useFetchTransactions"

const theme = createTheme({
  breakpoints: { values: { tablet: 768 } },
})

const visibleColumnsConfig = (isMobile) => [
  { id: "date", label: "Date", show: true },
  { id: "label", label: "Libellé", show: true },
  { id: "debit", label: "Débit", show: true },
  { id: "credit", label: "Crédit", show: true },
  { id: "balance", label: "Solde", show: !isMobile },
  { id: "status", label: "État", show: !isMobile },
]

const Transactions = () => {
  const dispatch = useDispatch()
  const tableContainerRef = useRef(null)

  const bankAccountName = useSelector(
    (state) => state.parameters.bankAccount.name
  )
  const bankAccountId = useSelector((state) => state.parameters.bankAccount.id)

  const selectedTransactionIds = useSelector(
    (state) => state.parameters.selectedTransactionIds
  )
  const isTransactionEditWindowVisible = useSelector(
    (state) => state.parameters.isTransactionEditWindowVisible
  )

  const transactionsTableScrollPosition = useSelector(
    (state) => state.parameters.transactionsTableScrollPosition
  )

  const newTransactionId = useSelector(
    (state) => state.parameters.newTransactionId
  )

  const transactionRefs = useRef({})

  const isMobile = useMediaQuery(theme.breakpoints.down("tablet"))
  const visibleColumns = visibleColumnsConfig(isMobile)

  const [dateFilter, setDateFilter] = useState("all")
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("date")
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null)

  const {
    isLoading: isLoadingTransactions,
    error: errorTransactions,
    data: transactionsData,
  } = useFetchTransactions()

  const handleSort = (property) => {
    setOrder(orderBy === property && order === "asc" ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleRowClick = (e, tx, index) => {
    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(index, lastSelectedIndex)
      const end = Math.max(index, lastSelectedIndex)
      const ids = sortedTransactions.slice(start, end + 1).map((t) => t.id)
      dispatch(
        setSelectedTransactionIds([
          ...new Set([...selectedTransactionIds, ...ids]),
        ])
      )
    } else if (e.ctrlKey || e.metaKey) {
      selectedTransactionIds.includes(tx.id)
        ? dispatch(removeSelectedTransactionId(tx.id))
        : dispatch(addSelectedTransactionId(tx.id))
      setLastSelectedIndex(index)
    } else {
      dispatch(setSelectedTransactionIds([tx.id]))
      setLastSelectedIndex(index)
    }
  }

  const handleScroll = (e) => {
    dispatch(setTransactionsTableScrollPosition(e.currentTarget.scrollTop))
  }

  useEffect(() => {
    const container = tableContainerRef.current
    if (!container) return

    if (transactionsTableScrollPosition !== null) {
      container.scrollTop = transactionsTableScrollPosition
    } else {
      container.scrollTop = container.scrollHeight
      dispatch(setTransactionsTableScrollPosition(container.scrollTop))
    }

    if (newTransactionId) {
      const element = transactionRefs.current[newTransactionId]
      if (element) {
        container.scrollTo({
          top: element.offsetTop - 100,
          behavior: "auto",
        })
      }
      dispatch(setNewTransactionId(null))
    }
  }, [transactionsTableScrollPosition, dispatch])

  if (isLoadingTransactions) return <p>Chargement des transactions...</p>
  if (errorTransactions) return <p>Erreur : {errorTransactions.message}</p>

  const transactions = transactionsData.filter(
    (transaction) => transaction.accountId === bankAccountId
  )

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

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aValue = a[orderBy],
      bValue = b[orderBy]
    if (orderBy === "date")
      return order === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue)
    if (typeof aValue === "number" && typeof bValue === "number")
      return order === "asc" ? aValue - bValue : bValue - aValue
    return order === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })

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

      <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <TableContainer
          component={Paper}
          ref={tableContainerRef}
          sx={{ flex: 1, overflow: "auto" }}
          onScroll={(e) => {
            handleScroll(e)
          }}
        >
          <Table aria-label="transactions">
            <TableHead>
              <TableRow>
                {visibleColumns
                  .filter((col) => col.show)
                  .map((col) => (
                    <TableCell
                      key={col.id}
                      align="center"
                      sx={{
                        height: 14,
                        paddingTop: 1,
                        paddingBottom: 1,
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#f5f5f5",
                        zIndex: 1,
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={() => handleSort(col.id)}
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedTransactions.map((tx, index) => {
                const balance = sortedTransactions
                  .slice(0, index + 1)
                  .reduce((acc, t) => acc + (t.credit || 0) - (t.debit || 0), 0)

                return (
                  <TableRow
                    key={tx.id}
                    ref={(el) => {
                      if (el) transactionRefs.current[tx.id] = el
                    }}
                    onClick={(e) => handleRowClick(e, tx, index)}
                    className={
                      selectedTransactionIds.includes(tx.id)
                        ? "transaction-row rowSelected"
                        : "transaction-row"
                    }
                  >
                    <TableCell align="center">
                      {new Date(tx.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{tx.label}</TableCell>
                    <TableCell align="right">
                      {tx.debit ? tx.debit.toFixed(2) : ""}
                    </TableCell>
                    <TableCell align="right">
                      {tx.credit ? tx.credit.toFixed(2) : ""}
                    </TableCell>
                    {visibleColumns.find(
                      (col) => col.id === "balance" && col.show
                    ) && (
                      <TableCell align="right" className={`cell__balance ${balance > 0 ? "" : "cell__balance-negative"}`}>{balance.toFixed(2)}</TableCell>
                    )}
                    {visibleColumns.find(
                      (col) => col.id === "status" && col.show
                    ) && (
                      <TableCell align="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor:
                              tx.status === "validated"
                                ? "green"
                                : tx.status === "pointed"
                                ? "blue"
                                : "white",
                            border: "1px solid #ccc",
                            margin: "0 auto",
                          }}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {sortedTransactions.length === 0 && (
            <Typography
              variant="body2"
              sx={{ padding: 2, textAlign: "center" }}
            >
              Aucune transaction trouvée.
            </Typography>
          )}
        </TableContainer>
      </Box>
    </section>
  )
}

export default Transactions
